// src/tools/component-analyzer-tool.ts
import { Tool, ComponentAnalysis, LLMProvider } from '../types/agent.js';
import { BaseTool } from '../core/base-interfaces.js';
import {
    Project,
    SyntaxKind,
    Node,
    FunctionDeclaration,
    ArrowFunction,
    VariableDeclaration,
    PropertySignature,
    InterfaceDeclaration,
    TypeAliasDeclaration,
    ImportDeclaration,
    CallExpression,
    PropertyAccessExpression,
    Identifier,
    SourceFile,
    JsxElement,
    JsxSelfClosingElement,
    JsxOpeningElement,
    JsxAttribute,
    JsxExpression,
    StringLiteral,
    ObjectLiteralExpression,
    BinaryExpression,
    VariableStatement,
    FunctionLikeDeclaration,
    ParameterDeclaration,
    ReturnStatement,
    Block,
    ExpressionStatement,
    VariableDeclarationKind,
} from 'ts-morph';
import path from 'path';
import fs from 'fs';

// Расширенный тип для детального анализа
export interface DetailedComponentAnalysis extends ComponentAnalysis {
    subComponents?: string[];
    externalServices?: string[];
    contextUsages?: string[];
    reduxSlices?: string[];
    networkCalls?: { url: string; method: string }[];
    localImports?: string[];
    astNode?: any;
}

export class ComponentAnalyzerTool extends BaseTool implements Tool {
    name = 'component_analyzer';
    description = 'Анализирует React компонент на основе AST (ts-morph) с учётом вложенности и связанности';

    private project: Project;
    private cache: Map<string, DetailedComponentAnalysis> = new Map();

    constructor(private llm: LLMProvider) {
        super();
        // Инициализируем проект ts-morph с настройками для резолва модулей
        this.project = new Project({
            tsConfigFilePath: 'tsconfig.json',
            skipAddingFilesFromTsConfig: true,
        });
    }

    /**
     * Основной метод выполнения анализа
     */
    async execute(input: { code: string; componentPath: string }): Promise<ComponentAnalysis> {
        try {
            const { code, componentPath } = input;

            const cacheKey = `${componentPath}_${this.hashCode(code)}`;
            if (this.cache.has(cacheKey)) {
                console.log(`📦 Использую кеш для ${componentPath}`);
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
            console.error('❌ Ошибка AST-анализа, использую базовый анализ:', error);
            return this.basicAnalyze(input.code);
        }
    }

    /**
     * Анализирует один source-файл и возвращает DetailedComponentAnalysis
     */
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
            console.warn('⚠️ Компонент не найден, используем базовый анализ');
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

    // ---------- ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ----------

    private extractImports(sourceFile: SourceFile, result: DetailedComponentAnalysis): void {
        const imports = sourceFile.getImportDeclarations();
        for (const imp of imports) {
            const moduleSpecifier = imp.getModuleSpecifierValue();
            if (moduleSpecifier) {
                if (moduleSpecifier.startsWith('.')) {
                    result.localImports!.push(moduleSpecifier);
                }
                if (!result.dependencies.includes(moduleSpecifier) && !moduleSpecifier.startsWith('.')) {
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
    }

    private findComponentNode(sourceFile: SourceFile): Node | undefined {
        const defaultExport = sourceFile.getDefaultExportSymbol();
        if (defaultExport) {
            const declarations = defaultExport.getDeclarations();
            if (declarations.length > 0) {
                return declarations[0];
            }
        }

        const namedExports = sourceFile.getExportedDeclarations();
        for (const [name, decls] of namedExports) {
            for (const decl of decls) {
                if (Node.isFunctionDeclaration(decl) || Node.isVariableDeclaration(decl) || Node.isClassDeclaration(decl)) {
                    if (this.isReactComponent(decl)) {
                        return decl;
                    }
                }
            }
        }

        const functions = sourceFile.getFunctions();
        for (const func of functions) {
            if (this.isReactComponent(func)) {
                return func;
            }
        }

        const variableStatements = sourceFile.getVariableStatements();
        for (const stmt of variableStatements) {
            const declarations = stmt.getDeclarations();
            for (const decl of declarations) {
                if (this.isReactComponent(decl)) {
                    return decl;
                }
            }
        }

        return undefined;
    }

    private isReactComponent(node: Node): boolean {
        const jsxElements = node.getDescendantsOfKind(SyntaxKind.JsxElement);
        if (jsxElements.length > 0) return true;
        const jsxSelfClosing = node.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
        if (jsxSelfClosing.length > 0) return true;

        const calls = node.getDescendantsOfKind(SyntaxKind.CallExpression);
        for (const call of calls) {
            const expression = call.getExpression();
            if (Node.isPropertyAccessExpression(expression)) {
                const name = expression.getName();
                if (name === 'createElement') {
                    const propAccess = expression.getExpression();
                    if (Node.isIdentifier(propAccess) && propAccess.getText() === 'React') {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private extractProps(componentNode: Node, result: DetailedComponentAnalysis): void {
        let propsTypeName: string | undefined;

        // Если это функция или стрелочная функция
        if (Node.isFunctionDeclaration(componentNode) || Node.isArrowFunction(componentNode) || Node.isFunctionExpression(componentNode)) {
            const func = componentNode as FunctionLikeDeclaration;
            const params = func.getParameters();
            if (params.length > 0) {
                const firstParam = params[0];
                const typeNode = firstParam.getTypeNode();
                if (typeNode) {
                    if (Node.isTypeReference(typeNode)) {
                        propsTypeName = typeNode.getTypeName().getText();
                    }
                } else {
                    const paramName = firstParam.getName();
                    if (paramName.includes('{')) {
                        const descendants = firstParam.getDescendantsOfKind(SyntaxKind.PropertySignature);
                        for (const prop of descendants) {
                            const name = prop.getName();
                            const type = prop.getTypeNode()?.getText() || 'any';
                            result.props.push({
                                name,
                                type,
                                required: true,
                                defaultValue: undefined,
                            });
                        }
                    }
                }
            }
        }

        if (propsTypeName) {
            const sourceFile = componentNode.getSourceFile();
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
            } else {
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
        }

        // Если пропсы не найдены, но есть деструктуризация в параметрах
        if (result.props.length === 0 && (Node.isFunctionDeclaration(componentNode) || Node.isArrowFunction(componentNode) || Node.isFunctionExpression(componentNode))) {
            const func = componentNode as FunctionLikeDeclaration;
            const params = func.getParameters();
            if (params.length > 0) {
                const firstParam = params[0];
                const paramText = firstParam.getText();
                if (paramText.includes('{') && paramText.includes('}')) {
                    // дополнительный парсинг можно не делать, т.к. уже обработали выше
                }
            }
        }
    }

    private extractHooks(componentNode: Node, result: DetailedComponentAnalysis): void {
        const calls = componentNode.getDescendantsOfKind(SyntaxKind.CallExpression);
        for (const call of calls) {
            const expression = call.getExpression();
            if (Node.isIdentifier(expression)) {
                const name = expression.getText();
                switch (name) {
                    case 'useState': {
                        const args = call.getArguments();
                        const initialValue = args.length > 0 ? args[0].getText() : 'undefined';
                        const parent = call.getParent();
                        if (parent && Node.isVariableDeclaration(parent)) {
                            const varName = parent.getName();
                            if (varName) {
                                result.states.push({
                                    name: varName,
                                    type: 'any',
                                    initialValue,
                                });
                            } else {
                                result.states.push({
                                    name: `state${result.states.length + 1}`,
                                    type: 'any',
                                    initialValue,
                                });
                            }
                        } else {
                            result.states.push({
                                name: `state${result.states.length + 1}`,
                                type: 'any',
                                initialValue,
                            });
                        }
                        break;
                    }
                    case 'useEffect': {
                        const deps = call.getArguments()[1];
                        const depArray = deps ? deps.getText() : '[]';
                        result.effects.push({
                            dependencies: [depArray],
                            purpose: 'effect',
                        });
                        break;
                    }
                    case 'useContext': {
                        const contextArg = call.getArguments()[0];
                        if (contextArg) {
                            const contextName = contextArg.getText();
                            result.contextUsages!.push(contextName);
                        }
                        break;
                    }
                    case 'useReducer':
                        // можно добавить обработку
                        break;
                    case 'useMemo':
                    case 'useCallback':
                        break;
                    default:
                        if (name.startsWith('use')) {
                            result.dependencies.push(name);
                        }
                        break;
                }
            }
        }
    }

    private extractEventHandlers(componentNode: Node, result: DetailedComponentAnalysis): void {
        const functions = componentNode.getDescendantsOfKind(SyntaxKind.FunctionDeclaration);
        for (const func of functions) {
            const name = func.getName();
            if (name && (name.startsWith('handle') || name.startsWith('on'))) {
                result.events.push({
                    name,
                    parameters: func.getParameters().map(p => p.getText()),
                });
            }
        }

        const varDecls = componentNode.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
        for (const decl of varDecls) {
            const name = decl.getName();
            if (name && (name.startsWith('handle') || name.startsWith('on'))) {
                const initializer = decl.getInitializer();
                if (initializer && Node.isArrowFunction(initializer)) {
                    const params = initializer.getParameters().map(p => p.getText());
                    result.events.push({ name, parameters: params });
                }
            }
        }
    }

    private extractSubComponents(componentNode: Node, result: DetailedComponentAnalysis): void {
        const jsxElements = componentNode.getDescendantsOfKind(SyntaxKind.JsxElement);
        const selfClosing = componentNode.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);

        const allJsx = [...jsxElements, ...selfClosing];
        for (const jsx of allJsx) {
            let tagName: string | undefined;
            if (Node.isJsxElement(jsx)) {
                const opening = jsx.getOpeningElement();
                tagName = opening.getTagNameNode().getText();
            } else if (Node.isJsxSelfClosingElement(jsx)) {
                tagName = jsx.getTagNameNode().getText();
            }
            if (tagName && tagName[0] && tagName[0] === tagName[0].toUpperCase()) {
                if (!result.subComponents!.includes(tagName)) {
                    result.subComponents!.push(tagName);
                }
            }
        }
    }

    private extractNetworkCalls(componentNode: Node, result: DetailedComponentAnalysis): void {
        const calls = componentNode.getDescendantsOfKind(SyntaxKind.CallExpression);
        for (const call of calls) {
            const expression = call.getExpression();
            let methodName = '';
            let objectName = '';
            if (Node.isPropertyAccessExpression(expression)) {
                methodName = expression.getName();
                const obj = expression.getExpression();
                if (Node.isIdentifier(obj)) {
                    objectName = obj.getText();
                }
            } else if (Node.isIdentifier(expression)) {
                methodName = expression.getText();
            }

            const isNetworkCall =
                methodName === 'fetch' ||
                (methodName === 'get' && objectName === 'axios') ||
                (methodName === 'post' && objectName === 'axios') ||
                (methodName === 'put' && objectName === 'axios') ||
                (methodName === 'delete' && objectName === 'axios') ||
                (methodName === 'patch' && objectName === 'axios');

            if (isNetworkCall) {
                const args = call.getArguments();
                let url = '';
                let method = methodName;
                if (args.length > 0) {
                    const firstArg = args[0];
                    if (Node.isStringLiteral(firstArg)) {
                        url = firstArg.getLiteralValue();
                    } else if (Node.isTemplateExpression(firstArg)) {
                        url = firstArg.getText();
                    } else {
                        url = firstArg.getText();
                    }
                }
                result.networkCalls!.push({ url, method });
                if (!result.externalServices!.includes('api')) {
                    result.externalServices!.push('api');
                }
            }
        }
    }

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

    private determineComponentType(componentNode: Node): string {
        if (Node.isClassDeclaration(componentNode)) {
            return 'class';
        }
        const hasUseState = componentNode.getDescendantsOfKind(SyntaxKind.CallExpression)
            .some(call => Node.isIdentifier(call.getExpression()) && call.getExpression().getText() === 'useState');
        const hasUseEffect = componentNode.getDescendantsOfKind(SyntaxKind.CallExpression)
            .some(call => Node.isIdentifier(call.getExpression()) && call.getExpression().getText() === 'useEffect');
        if (hasUseState || hasUseEffect) {
            return 'stateful';
        }
        return 'functional';
    }

    // ---------- FALLBACK ----------

    private basicAnalyze(code: string): ComponentAnalysis {
        const props: any[] = [];
        const states: any[] = [];
        const effects: any[] = [];
        const events: any[] = [];
        const dependencies: string[] = [];

        const importMatches = code.match(/from\s+['"]([^'"]+)['"]/g) || [];
        importMatches.forEach(match => {
            const dep = match.replace(/from\s+['"]([^'"]+)['"]/, '$1');
            if (dep && !dep.startsWith('.')) {
                dependencies.push(dep);
            }
        });

        const useStateMatches = code.match(/useState\(([^)]*)\)/g) || [];
        useStateMatches.forEach((match, i) => {
            states.push({
                name: `state${i + 1}`,
                type: 'any',
                initialValue: match
            });
        });

        const useEffectMatches = code.match(/useEffect\(/g) || [];
        useEffectMatches.forEach((_, i) => {
            effects.push({
                dependencies: [],
                purpose: `effect${i + 1}`
            });
        });

        let componentType = 'functional';
        if (code.includes('class') && code.includes('extends')) {
            componentType = 'class';
        }

        let complexity: 'low' | 'medium' | 'high' = 'low';
        const score = states.length + effects.length + dependencies.length;
        if (score > 8) complexity = 'high';
        else if (score > 4) complexity = 'medium';

        return {
            props,
            states,
            effects,
            events,
            dependencies,
            complexity,
            componentType
        };
    }

    private basicAnalyzeWithAST(sourceFile: SourceFile, result: DetailedComponentAnalysis): DetailedComponentAnalysis {
        this.extractImports(sourceFile, result);
        result.complexity = 'low';
        result.componentType = 'unknown';
        return result;
    }

    // ---------- КЕШИРОВАНИЕ ----------

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