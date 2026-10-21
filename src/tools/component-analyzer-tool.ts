import { Tool, ComponentAnalysis, LLMProvider } from '../types/agent.js';
import { BaseTool } from '../core/base-interfaces.js';
import {
    Project,
    SyntaxKind,
    Node,
    SourceFile,
    FunctionLikeDeclaration,
} from 'ts-morph';

// Расширенный тип анализа, используемый внутри инструмента
export interface DetailedComponentAnalysis extends ComponentAnalysis {
    subComponents?: string[];
    externalServices?: string[];
    contextUsages?: string[];
    reduxSlices?: string[];
    networkCalls?: { url: string; method: string }[];
    localImports?: string[];
}

export class ComponentAnalyzerTool extends BaseTool implements Tool {
    name = 'component_analyzer';
    description = 'Анализирует React компонент на основе AST (ts-morph) с учётом вложенности и связей';

    private project: Project;
    private cache: Map<string, DetailedComponentAnalysis> = new Map();

    constructor(private _llm: LLMProvider) {
        super();
        // Создаём проект ts-morph с настройками для резолва модулей
        this.project = new Project({
            tsConfigFilePath: 'tsconfig.json',
            skipAddingFilesFromTsConfig: true,
        });
    }

    // Основной метод: кэширует анализ по паре (путь + хэш кода)
    async execute(input: { code: string; componentPath: string }): Promise<ComponentAnalysis> {
        try {
            const { code, componentPath } = input;

            const cacheKey = `${componentPath}_${this.hashCode(code)}`;
            if (this.cache.has(cacheKey)) {
                console.log(`📦 Использую кэш для ${componentPath}`);
                return this.cache.get(cacheKey)!;
            }

            const sourceFile = this.project.createSourceFile(
                componentPath,
                code,
                { overwrite: true }
            );

            const analysis = this.analyzeSourceFile(sourceFile);
            this.cache.set(cacheKey, analysis);
            return analysis;
        } catch (error) {
            console.error('❌ Ошибка AST-анализа, использую базовый:', error);
            return this.basicAnalyze(input.code);
        }
    }

    // Обходит один source-файл и собирает все доступные метрики
    private analyzeSourceFile(sourceFile: SourceFile): DetailedComponentAnalysis {
        const result: DetailedComponentAnalysis = {
            props: [],
            states: [],
            effects: [],
            events: [],
            dependencies: [],
            complexity: 'low',
            componentType: 'functional',
            subComponents: [],
            externalServices: [],
            contextUsages: [],
            reduxSlices: [],
            networkCalls: [],
            localImports: [],
        };

        this.extractImports(sourceFile, result);

        const componentNode = this.findComponentNode(sourceFile);
        if (!componentNode) {
            console.warn('⚠️ Компонент не найден, используем fallback-анализ');
            return this.basicAnalyzeWithAST(sourceFile, result);
        }

        this.extractProps(componentNode, result);
        this.extractHooks(componentNode, result);
        this.extractEventHandlers(componentNode, result);
        this.extractSubComponents(componentNode, result);
        this.extractNetworkCalls(componentNode, result);

        result.complexity = this.calculateComplexity(result);
        result.componentType = this.determineComponentType(componentNode);

        return result;
    }

    // Импорты: разбиваем на локальные, внешние, redux и API-клиенты
    private extractImports(sourceFile: SourceFile, result: DetailedComponentAnalysis): void {
        const imports = sourceFile.getImportDeclarations();
        for (const imp of imports) {
            const moduleSpecifier = imp.getModuleSpecifierValue();
            if (!moduleSpecifier) continue;

            if (moduleSpecifier.startsWith('.')) {
                result.localImports!.push(moduleSpecifier);
                continue;
            }

            if (!result.dependencies.includes(moduleSpecifier)) {
                result.dependencies.push(moduleSpecifier);
            }
            if (moduleSpecifier.includes('redux') || moduleSpecifier.includes('@reduxjs')) {
                result.reduxSlices!.push(moduleSpecifier);
            }
            if (moduleSpecifier.includes('react-redux')) {
                result.reduxSlices!.push('react-redux');
            }
            if (moduleSpecifier.includes('axios') || moduleSpecifier.includes('fetch')) {
                result.externalServices!.push(moduleSpecifier);
            }
        }
    }

    // Ищет узел, соответствующий React-компоненту
    private findComponentNode(sourceFile: SourceFile): Node | undefined {
        // Сначала проверяем default export
        const defaultExport = sourceFile.getDefaultExportSymbol();
        if (defaultExport) {
            const declarations = defaultExport.getDeclarations();
            if (declarations.length > 0) return declarations[0];
        }

        // Затем именованные экспорты
        const namedExports = sourceFile.getExportedDeclarations();
        for (const [, decls] of namedExports) {
            for (const decl of decls) {
                if (
                    (Node.isFunctionDeclaration(decl) ||
                        Node.isVariableDeclaration(decl) ||
                        Node.isClassDeclaration(decl)) &&
                    this.isReactComponent(decl)
                ) {
                    return decl;
                }
            }
        }

        // В конце — все функции и переменные файла
        for (const func of sourceFile.getFunctions()) {
            if (this.isReactComponent(func)) return func;
        }
        for (const stmt of sourceFile.getVariableStatements()) {
            for (const decl of stmt.getDeclarations()) {
                if (this.isReactComponent(decl)) return decl;
            }
        }

        return undefined;
    }

    // Эвристика: компонент — это то, что рендерит JSX или использует React.createElement
    private isReactComponent(node: Node): boolean {
        if (node.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0) return true;
        if (node.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0) return true;

        for (const call of node.getDescendantsOfKind(SyntaxKind.CallExpression)) {
            const expression = call.getExpression();
            if (Node.isPropertyAccessExpression(expression) && expression.getName() === 'createElement') {
                const propAccess = expression.getExpression();
                if (Node.isIdentifier(propAccess) && propAccess.getText() === 'React') {
                    return true;
                }
            }
        }
        return false;
    }

    // Извлекаем пропсы: через TypeReference на интерфейс/тип или через деструктуризацию
    private extractProps(componentNode: Node, result: DetailedComponentAnalysis): void {
        if (!(
            Node.isFunctionDeclaration(componentNode) ||
            Node.isArrowFunction(componentNode) ||
            Node.isFunctionExpression(componentNode)
        )) {
            return;
        }

        const func = componentNode as FunctionLikeDeclaration;
        const params = func.getParameters();
        if (params.length === 0) return;

        const firstParam = params[0];
        const typeNode = firstParam.getTypeNode();

        // Случай 1: тип пропсов — это именованный TypeReference (IProps, Props и т.д.)
        if (typeNode && Node.isTypeReference(typeNode)) {
            const propsTypeName = typeNode.getTypeName().getText();
            this.extractPropsFromTypeName(componentNode.getSourceFile(), propsTypeName, result);
            return;
        }

        // Случай 2: деструктуризация в параметре без явного типа
        if (firstParam.getName().includes('{')) {
            for (const prop of firstParam.getDescendantsOfKind(SyntaxKind.PropertySignature)) {
                result.props.push({
                    name: prop.getName(),
                    type: prop.getTypeNode()?.getText() || 'any',
                    required: true,
                    defaultValue: undefined,
                });
            }
        }
    }

    // Достаёт поля из интерфейса или type-alias по имени
    private extractPropsFromTypeName(
        sourceFile: SourceFile,
        propsTypeName: string,
        result: DetailedComponentAnalysis
    ): void {
        const interfaceDecl = sourceFile.getInterface(propsTypeName);
        if (interfaceDecl) {
            for (const prop of interfaceDecl.getProperties()) {
                result.props.push({
                    name: prop.getName(),
                    type: prop.getTypeNode()?.getText() || 'any',
                    required: !prop.hasQuestionToken(),
                    defaultValue: undefined,
                });
            }
            return;
        }

        const typeAlias = sourceFile.getTypeAlias(propsTypeName);
        if (typeAlias) {
            const typeNode = typeAlias.getTypeNode();
            if (typeNode && Node.isTypeLiteral(typeNode)) {
                for (const prop of typeNode.getProperties()) {
                    result.props.push({
                        name: prop.getName(),
                        type: prop.getTypeNode()?.getText() || 'any',
                        required: !prop.hasQuestionToken(),
                        defaultValue: undefined,
                    });
                }
            }
        }
    }

    // Хуки: useState, useEffect, useContext — самое важное для тестов
    private extractHooks(componentNode: Node, result: DetailedComponentAnalysis): void {
        for (const call of componentNode.getDescendantsOfKind(SyntaxKind.CallExpression)) {
            const expression = call.getExpression();
            if (!Node.isIdentifier(expression)) continue;

            const name = expression.getText();
            switch (name) {
                case 'useState': {
                    const args = call.getArguments();
                    const initialValue = args.length > 0 ? args[0].getText() : 'undefined';
                    const parent = call.getParent();

                    let varName = `state${result.states.length + 1}`;
                    if (parent && Node.isVariableDeclaration(parent)) {
                        const nameFromDecl = parent.getName();
                        if (nameFromDecl) varName = nameFromDecl;
                    }
                    result.states.push({ name: varName, type: 'any', initialValue });
                    break;
                }
                case 'useEffect': {
                    const deps = call.getArguments()[1];
                    const depArray = deps ? deps.getText() : '[]';
                    result.effects.push({ dependencies: [depArray], purpose: 'effect' });
                    break;
                }
                case 'useContext': {
                    const contextArg = call.getArguments()[0];
                    if (contextArg) {
                        result.contextUsages!.push(contextArg.getText());
                    }
                    break;
                }
                default:
                    if (name.startsWith('use')) {
                        result.dependencies.push(name);
                    }
                    break;
            }
        }
    }

    // Обработчики: функции/стрелки с именами handle* или on*
    private extractEventHandlers(componentNode: Node, result: DetailedComponentAnalysis): void {
        for (const func of componentNode.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)) {
            const name = func.getName();
            if (name && (name.startsWith('handle') || name.startsWith('on'))) {
                result.events.push({
                    name,
                    parameters: func.getParameters().map(p => p.getText()),
                });
            }
        }

        for (const decl of componentNode.getDescendantsOfKind(SyntaxKind.VariableDeclaration)) {
            const name = decl.getName();
            if (!name || !(name.startsWith('handle') || name.startsWith('on'))) continue;

            const initializer = decl.getInitializer();
            if (initializer && Node.isArrowFunction(initializer)) {
                result.events.push({
                    name,
                    parameters: initializer.getParameters().map(p => p.getText()),
                });
            }
        }
    }

    // Дочерние компоненты: JSX с заглавной буквы (не HTML-теги)
    private extractSubComponents(componentNode: Node, result: DetailedComponentAnalysis): void {
        const allJsx = [
            ...componentNode.getDescendantsOfKind(SyntaxKind.JsxElement),
            ...componentNode.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
        ];

        for (const jsx of allJsx) {
            let tagName: string | undefined;
            if (Node.isJsxElement(jsx)) {
                tagName = jsx.getOpeningElement().getTagNameNode().getText();
            } else if (Node.isJsxSelfClosingElement(jsx)) {
                tagName = jsx.getTagNameNode().getText();
            }

            if (tagName && tagName[0] === tagName[0].toUpperCase()) {
                if (!result.subComponents!.includes(tagName)) {
                    result.subComponents!.push(tagName);
                }
            }
        }
    }

    // Сетевые вызовы: fetch(...) и axios.get/post/...
    private extractNetworkCalls(componentNode: Node, result: DetailedComponentAnalysis): void {
        for (const call of componentNode.getDescendantsOfKind(SyntaxKind.CallExpression)) {
            const expression = call.getExpression();
            let methodName = '';
            let objectName = '';

            if (Node.isPropertyAccessExpression(expression)) {
                methodName = expression.getName();
                const obj = expression.getExpression();
                if (Node.isIdentifier(obj)) objectName = obj.getText();
            } else if (Node.isIdentifier(expression)) {
                methodName = expression.getText();
            }

            const isNetworkCall =
                methodName === 'fetch' ||
                (['get', 'post', 'put', 'delete', 'patch'].includes(methodName) && objectName === 'axios');

            if (!isNetworkCall) continue;

            const args = call.getArguments();
            const firstArg = args[0];
            const url = firstArg ? firstArg.getText() : '';

            result.networkCalls!.push({ url, method: methodName });
            if (!result.externalServices!.includes('api')) {
                result.externalServices!.push('api');
            }
        }
    }

    // Итоговая оценка сложности по метрикам
    private calculateComplexity(result: DetailedComponentAnalysis): 'low' | 'medium' | 'high' {
        const props = result.props.length;
        const states = result.states.length;
        const effects = result.effects.length;
        const events = result.events.length;
        const deps = result.dependencies.length;
        const score = props + states * 2 + effects * 1.5 + events * 0.5 + deps * 0.3;
        if (score > 10) return 'high';
        if (score > 5) return 'medium';
        return 'low';
    }

    // Класс или функция + наличие хуков
    private determineComponentType(componentNode: Node): string {
        if (Node.isClassDeclaration(componentNode)) return 'class';

        const hasUseState = componentNode.getDescendantsOfKind(SyntaxKind.CallExpression)
            .some(call => Node.isIdentifier(call.getExpression()) && call.getExpression().getText() === 'useState');
        const hasUseEffect = componentNode.getDescendantsOfKind(SyntaxKind.CallExpression)
            .some(call => Node.isIdentifier(call.getExpression()) && call.getExpression().getText() === 'useEffect');

        if (hasUseState || hasUseEffect) return 'stateful';
        return 'functional';
    }

    // Аварийный анализ (регулярками), если AST не отработал
    private basicAnalyze(code: string): ComponentAnalysis {
        const states: any[] = [];
        const effects: any[] = [];
        const dependencies: string[] = [];

        for (const match of code.match(/from\s+['"]([^'"]+)['"]/g) || []) {
            const dep = match.replace(/from\s+['"]([^'"]+)['"]/, '$1');
            if (dep && !dep.startsWith('.')) dependencies.push(dep);
        }

        (code.match(/useState\(([^)]*)\)/g) || []).forEach((match, i) => {
            states.push({ name: `state${i + 1}`, type: 'any', initialValue: match });
        });
        (code.match(/useEffect\(/g) || []).forEach((_, i) => {
            effects.push({ dependencies: [], purpose: `effect${i + 1}` });
        });

        let componentType = 'functional';
        if (code.includes('class') && code.includes('extends')) componentType = 'class';

        let complexity: 'low' | 'medium' | 'high' = 'low';
        const score = states.length + effects.length + dependencies.length;
        if (score > 8) complexity = 'high';
        else if (score > 4) complexity = 'medium';

        return {
            props: [],
            states,
            effects,
            events: [],
            dependencies,
            complexity,
            componentType,
        };
    }

    // Fallback через AST: хотя бы импорты
    private basicAnalyzeWithAST(sourceFile: SourceFile, result: DetailedComponentAnalysis): DetailedComponentAnalysis {
        this.extractImports(sourceFile, result);
        result.complexity = 'low';
        result.componentType = 'unknown';
        return result;
    }

    private hashCode(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    clearCache(): void {
        this.cache.clear();
    }
}