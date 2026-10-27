import fs from 'fs';
import path from 'path';
import pLimit from 'p-limit';
import { BaseTool } from '../../core/base-interfaces';
import { ComponentAnalysis, LLMProvider, Tool, TestPlan } from '../../types/agent';
import {
    TestType,
    TestGenerationInput,
    TestGenerationOutput,
    TestGenerationResult,
    GeneratedFile,
    TestSummary,
    GeneratorConfig,
    ITestGenerator
} from './types';
import { DEFAULT_CONFIG, DETECTION_THRESHOLDS, COMPONENT_NAME_PATTERNS } from './constants';

import { UnitTestGenerator } from './generators/UnitTestGenerator';
import { IntegrationTestGenerator } from './generators/IntegrationTestGenerator';
import { E2ETestGenerator } from './generators/E2ETestGenerator';
import { SnapshotTestGenerator } from './generators/SnapshotTestGenerator';
import { VisualRegressionTestGenerator } from './generators/VisualRegressionTestGenerator';
import { PerformanceTestGenerator } from './generators/PerformanceTestGenerator';
import { BaseTestGenerator } from './generators/base/BaseTestGenerator';

export class TestGeneratorTool extends BaseTool implements Tool {
    name = 'test_generator';
    description = 'Генерирует различные типы тестов для React компонентов';

    private generators: Map<TestType, ITestGenerator>;
    private config: GeneratorConfig;
    private generationCache = new Map<string, TestGenerationOutput>();
    private readonly MAX_CONCURRENT_GENERATIONS = 2;

    constructor(private llm: LLMProvider, config?: Partial<GeneratorConfig>) {
        super();
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.generators = this.initializeGenerators();
    }

    // Регистрируем все доступные генераторы
    private initializeGenerators(): Map<TestType, ITestGenerator> {
        const generators: ITestGenerator[] = [
            new UnitTestGenerator(this.llm),
            new IntegrationTestGenerator(this.llm),
            new E2ETestGenerator(this.llm),
            new SnapshotTestGenerator(this.llm),
            new VisualRegressionTestGenerator(this.llm),
            new PerformanceTestGenerator(this.llm)
        ];
        return new Map(generators.map(g => [g.type, g]));
    }

    // Главная точка входа — генерирует, сохраняет и агрегирует результаты
    async execute(input: {
        componentCode: string;
        componentPath: string;
        analysis: ComponentAnalysis;
        framework: string;
        testTypes?: TestType[];
        exclude?: TestType[];
        options?: Record<string, any>;
    }): Promise<TestGenerationResult> {
        const startTime = Date.now();
        const errors: Array<{ type: TestType; error: string }> = [];

        try {
            if (!this.validateInput(input)) {
                throw new Error('Некорректный вход TestGeneratorTool');
            }

            const componentName = this.extractComponentName(input.componentCode);
            const componentDir = path.dirname(input.componentPath);
            this.logAnalysisDetails(input.analysis);

            let testTypes = input.testTypes ?? this.detectTestTypes(input.analysis);
            if (input.exclude?.length) {
                testTypes = testTypes.filter(t => !input.exclude!.includes(t));
            }

            console.log(`📦 Генерация тестов для ${componentName}`);
            console.log(`📋 Типы тестов: ${testTypes.join(', ')}`);

            const generationInput: TestGenerationInput = {
                componentCode: input.componentCode,
                componentName,
                componentPath: input.componentPath,
                analysis: input.analysis,
                options: {
                    ...input.options,
                    networkCalls: input.analysis.networkCalls,
                    subComponents: input.analysis.subComponents,
                    contextUsages: input.analysis.contextUsages,
                    reduxSlices: input.analysis.reduxSlices,
                    externalServices: input.analysis.externalServices,
                }
            };

            const results = await this.generateAllTestTypes(generationInput, testTypes);

            for (const [type] of results) {
                if (!results.get(type)) {
                    errors.push({
                        type,
                        error: `Не удалось сгенерировать ${type} тесты`
                    });
                }
            }

            const generatedFiles = await this.saveTestFiles(componentDir, componentName, results);

            const allTestCode = this.combineTestResults(results);
            const testCases = this.extractAllTestCases(results);
            const executionTime = Date.now() - startTime;

            const summary: TestSummary = {
                totalFiles: generatedFiles.length,
                totalTestCases: testCases.length,
                typesGenerated: Array.from(results.keys()) as TestType[],
                executionTime,
                errors: errors.length > 0 ? errors : undefined
            };

            const defaultPlan: TestPlan = {
                componentType: input.analysis.componentType || 'functional',
                testPriority: 'medium',
                requiredTests: testCases,
                dependencies: input.analysis.dependencies || [],
                estimatedTime: `${Math.round(executionTime / 1000)} секунд`,
                riskAreas: ['Сгенерировано автоматически']
            };

            return {
                plan: defaultPlan,
                analysis: input.analysis,
                filePath: input.componentPath,
                testCases,
                testCode: allTestCode,
                generatedFiles,
                summary
            };
        } catch (error) {
            console.error('❌ Ошибка в TestGeneratorTool:', error);
            return this.getFallbackResult(input.componentPath, startTime, input.analysis);
        }
    }

    validateInput(input: any, _schema?: any): boolean {
        if (!input) {
            console.error('❌ Вход пустой');
            return false;
        }
        if (!input.componentCode) {
            console.error('❌ componentCode обязателен');
            return false;
        }
        if (!input.componentPath) {
            console.error('❌ componentPath обязателен');
            return false;
        }
        if (!input.analysis) {
            console.error('❌ analysis обязателен');
            return false;
        }
        return true;
    }

    private logAnalysisDetails(analysis: ComponentAnalysis): void {
        if (analysis.subComponents?.length) {
            console.log(`🧩 Вложенные компоненты: ${analysis.subComponents.join(', ')}`);
        }
        if (analysis.networkCalls?.length) {
            console.log(`🌐 Сетевые вызовы: ${analysis.networkCalls.map(c => `${c.method} ${c.url}`).join(', ')}`);
        }
        if (analysis.contextUsages?.length) {
            console.log(`📦 Контексты: ${analysis.contextUsages.join(', ')}`);
        }
        if (analysis.reduxSlices?.length) {
            console.log(`🔴 Redux-слайсы: ${analysis.reduxSlices.join(', ')}`);
        }
    }

    // Запускает генерацию всех запрошенных типов параллельно (с ограничением)
    private async generateAllTestTypes(
        input: TestGenerationInput,
        testTypes: TestType[]
    ): Promise<Map<TestType, TestGenerationOutput>> {
        const limit = pLimit(this.MAX_CONCURRENT_GENERATIONS);
        const results = new Map<TestType, TestGenerationOutput>();

        const promises = testTypes.map(type =>
            limit(() => this.generateSingleTest(type, input))
        );
        const resultsArray = await Promise.all(promises);

        for (const item of resultsArray) {
            if (item) results.set(item.type, item.result);
        }
        return results;
    }

    private async generateSingleTest(
        type: TestType,
        input: TestGenerationInput
    ): Promise<{ type: TestType; result: TestGenerationOutput } | null> {
        const cacheKey = `${this.hashCode(input.componentCode)}_${type}_${this.hashCode(JSON.stringify(input.options || {}))}`;

        if (this.generationCache.has(cacheKey)) {
            console.log(`📦 Использую кэш для ${type} тестов`);
            return { type, result: this.generationCache.get(cacheKey)! };
        }

        const generator = this.generators.get(type);
        if (!generator) {
            console.warn(`⚠️ Генератор для ${type} не найден, пропускаем`);
            return null;
        }

        try {
            if (!generator.isApplicable(input.analysis)) {
                console.log(`ℹ️ Генератор ${type} не применим к этому компоненту`);
                return null;
            }

            console.log(`🔄 Генерация ${type} тестов...`);
            const result = await generator.generate(input);
            this.generationCache.set(cacheKey, result);
            console.log(`✅ ${type} тесты сгенерированы`);
            return { type, result };
        } catch (error) {
            console.error(`❌ Ошибка генерации ${type} тестов:`, error);
            return null;
        }
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

    // Автоматически определяет, какие типы тестов имеет смысл сгенерировать
    private detectTestTypes(analysis: ComponentAnalysis): TestType[] {
        const types = new Set<TestType>();
        const { props, states, effects, events, dependencies } = analysis;
        const { subComponents = [], networkCalls = [], contextUsages = [], reduxSlices = [] } = analysis;

        types.add(TestType.UNIT);
        types.add(TestType.SNAPSHOT);

        if (
            networkCalls.length > 0 ||
            contextUsages.length > 0 ||
            reduxSlices.length > 0 ||
            dependencies.length >= DETECTION_THRESHOLDS.integration.minDependencies ||
            effects.length >= DETECTION_THRESHOLDS.integration.minEffects
        ) {
            types.add(TestType.INTEGRATION);
        }

        if (
            events.length > DETECTION_THRESHOLDS.e2e.minEvents ||
            (networkCalls.length > 0 && subComponents.length > 0)
        ) {
            types.add(TestType.E2E);
        }

        if (props.some(p => p.type === 'string' || p.type === 'boolean')) {
            types.add(TestType.VISUAL);
        }

        if (
            props.length > DETECTION_THRESHOLDS.performance.maxProps ||
            states.length > DETECTION_THRESHOLDS.performance.maxStates ||
            effects.length > DETECTION_THRESHOLDS.performance.maxEffects
        ) {
            types.add(TestType.PERFORMANCE);
        }

        return Array.from(types);
    }

    // Пишет тесты и setup-файлы на диск, возвращает список созданных файлов
    private async saveTestFiles(
        componentDir: string,
        componentName: string,
        results: Map<TestType, TestGenerationOutput>
    ): Promise<GeneratedFile[]> {
        const generatedFiles: GeneratedFile[] = [];
        const testsBaseDir = path.join(componentDir, this.config.outputDir!);

        fs.mkdirSync(testsBaseDir, { recursive: true });

        for (const [type, result] of results) {
            if (!result) continue;

            const typeDir = path.join(testsBaseDir, type);
            fs.mkdirSync(typeDir, { recursive: true });

            const filePath = path.join(typeDir, result.testFileName);
            const fileContent = this.addFileHeader(result, componentName);

            fs.writeFileSync(filePath, fileContent, 'utf-8');

            generatedFiles.push({
                type,
                path: filePath,
                content: fileContent,
                size: Buffer.byteLength(fileContent, 'utf-8')
            });

            console.log(`📁 Файл сохранён: ${filePath}`);

            if (result.setupFiles?.length) {
                const setupFiles = await this.saveSetupFiles(typeDir, type, result.setupFiles);
                generatedFiles.push(...setupFiles);
            }
        }

        this.createTestIndexFile(testsBaseDir, results);
        return generatedFiles;
    }

    // Формирует JSDoc-шапку файла и добавляет подсказку по зависимостям
    private addFileHeader(result: TestGenerationOutput, componentName: string): string {
        const header = `/**
 * ${result.description}
 *
 * @file ${result.testFileName}
 * @description Тестирование ${componentName}
 * @generated ${new Date().toISOString()}
 * @type {${result.testType}}
 * @testCount ${result.metadata?.testCount || 0}
 * @dependencies ${result.dependencies?.join(', ') || 'нет'}
 * @mocks ${result.mocks?.join(', ') || 'нет'}
 */

`;

        let deps = '';
        if (result.dependencies?.length) {
            deps = `// npm install -D ${result.dependencies.join(' ')}\n\n`;
        }

        return header + deps + result.testCode;
    }

    // Сохраняет setup-файлы рядом с тестами и возвращает их описания
    private async saveSetupFiles(
        typeDir: string,
        type: TestType,
        setupFiles: string[]
    ): Promise<GeneratedFile[]> {
        const setupDir = path.join(typeDir, '__setup__');
        fs.mkdirSync(setupDir, { recursive: true });

        const files: GeneratedFile[] = [];
        for (let i = 0; i < setupFiles.length; i++) {
            const fileName = `setup-${i + 1}.ts`;
            const filePath = path.join(setupDir, fileName);
            fs.writeFileSync(filePath, setupFiles[i], 'utf-8');
            files.push({
                type,
                path: filePath,
                content: setupFiles[i],
                size: Buffer.byteLength(setupFiles[i], 'utf-8')
            });
            console.log(`🔧 Setup-файл сохранён: ${filePath}`);
        }
        return files;
    }

    // Создаёт barrel-файл (index.ts), реэкспортирующий все сгенерированные тесты
    private createTestIndexFile(
        testsBaseDir: string,
        results: Map<TestType, TestGenerationOutput>
    ): void {
        const exports: string[] = [];
        for (const [type, result] of results) {
            if (!result) continue;
            const importPath = `./${type}/${result.testFileName.replace(/\.(tsx|ts|jsx|js)$/, '')}`;
            exports.push(`export * from '${importPath}';`);
        }

        const indexContent = `/**
 * Barrel-файл для всех тестов компонента.
 * Сгенерирован автоматически.
 *
 * @generated ${new Date().toISOString()}
 * @types ${Array.from(results.keys()).join(', ')}
 */

${exports.join('\n')}
`;

        const indexPath = path.join(testsBaseDir, 'index.ts');
        fs.writeFileSync(indexPath, indexContent, 'utf-8');
        console.log(`📄 Index-файл создан: ${indexPath}`);
    }

    private combineTestResults(results: Map<TestType, TestGenerationOutput>): string {
        const parts: string[] = [];
        for (const [type, result] of results) {
            if (!result) continue;
            parts.push(`// ============================================`);
            parts.push(`// ${type.toUpperCase()} — ${result.testFileName}`);
            parts.push(`// ============================================`);
            parts.push(result.testCode);
            parts.push('');
        }
        return parts.join('\n');
    }

    private extractAllTestCases(results: Map<TestType, TestGenerationOutput>): string[] {
        const all: string[] = [];
        for (const [type, result] of results) {
            if (!result) continue;
            const cases = this.extractTestCases(result.testCode);
            all.push(...cases.map(tc => `[${type.toUpperCase()}] ${tc}`));
        }
        return all;
    }

    // Извлекает имена тестов (describe + it/test) из кода
    private extractTestCases(testCode: string): string[] {
        const testCases: string[] = [];
        let currentDescribe = '';

        for (const line of testCode.split('\n')) {
            const describeMatch = line.match(/describe\s*\(\s*['"]([^'"]+)['"]/);
            if (describeMatch) currentDescribe = describeMatch[1];

            const itMatch = line.match(/(?:it|test)\s*\(\s*['"]([^'"]+)['"]/);
            if (itMatch) {
                testCases.push(currentDescribe ? `[${currentDescribe}] ${itMatch[1]}` : itMatch[1]);
            }
        }

        return testCases.length > 0 ? testCases : ['[Рендеринг] Базовый рендеринг'];
    }

    // Ищет имя компонента по массиву паттернов
    private extractComponentName(code: string): string {
        for (const pattern of COMPONENT_NAME_PATTERNS) {
            const match = code.match(pattern);
            if (match) return match[1];
        }
        return 'Component';
    }

    // Аварийный результат, если генерация упала — генерируем хотя бы один базовый тест
    private getFallbackResult(
        componentPath: string,
        startTime: number,
        analysis: ComponentAnalysis
    ): TestGenerationResult {
        const componentName = path.basename(componentPath, path.extname(componentPath));
        const fallbackCode = this.generateFallbackCode(componentName);
        const fallbackDir = path.join(path.dirname(componentPath), '__tests__', 'unit');
        const fallbackPath = path.join(fallbackDir, `${componentName}.unit.test.tsx`);

        // Записываем файл на диск — иначе вызывающая сторона получит ссылку на несуществующий файл
        try {
            fs.mkdirSync(fallbackDir, { recursive: true });
            fs.writeFileSync(fallbackPath, fallbackCode, 'utf-8');
        } catch (writeError) {
            console.error('❌ Не удалось записать fallback-файл:', writeError);
        }

        const file: GeneratedFile = {
            type: TestType.UNIT,
            path: fallbackPath,
            content: fallbackCode,
            size: Buffer.byteLength(fallbackCode, 'utf-8')
        };

        const defaultPlan: TestPlan = {
            componentType: analysis.componentType || 'functional',
            testPriority: 'low',
            requiredTests: ['Базовый рендеринг'],
            dependencies: analysis.dependencies || [],
            estimatedTime: '5 минут',
            riskAreas: ['Сгенерировано в fallback-режиме']
        };

        return {
            plan: defaultPlan,
            analysis,
            filePath: componentPath,
            testCases: ['[Рендеринг] Базовый рендеринг'],
            testCode: fallbackCode,
            generatedFiles: [file],
            summary: {
                totalFiles: 1,
                totalTestCases: 1,
                typesGenerated: [TestType.UNIT],
                executionTime: Date.now() - startTime,
                errors: [{ type: TestType.UNIT, error: 'Fallback из-за ошибки' }]
            }
        };
    }

    // Минимальный рабочий тест на случай, если LLM не ответил
    private generateFallbackCode(componentName: string): string {
        return `import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ${componentName} } from '../${componentName}';

describe('${componentName}', () => {
    it('рендерится без падений', () => {
        render(<${componentName} />);
    });
});
`;
    }

    getAvailableGenerators(): Array<{ type: TestType; name: string; description: string }> {
        const result: Array<{ type: TestType; name: string; description: string }> = [];
        for (const [type, generator] of this.generators) {
            result.push({ type, name: generator.name, description: generator.description });
        }
        return result;
    }

    supportsTestType(type: TestType): boolean {
        return this.generators.has(type);
    }

    getGeneratorInfo(type: TestType): { name: string; description: string } | null {
        const generator = this.generators.get(type);
        if (!generator) return null;
        return { name: generator.name, description: generator.description };
    }

    clearAllCaches(): void {
        for (const [, generator] of this.generators) {
            if (generator instanceof BaseTestGenerator) generator.clearCache();
        }
        this.generationCache.clear();
        console.log('🧹 Кэш всех генераторов очищен');
    }
}