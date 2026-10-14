// src/tools/testGenerator/index.ts
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
import { DEFAULT_CONFIG, DETECTION_THRESHOLDS } from './constants';

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
    private isInitialized = false;

    private generationCache = new Map<string, TestGenerationOutput>();
    private readonly MAX_CONCURRENT_GENERATIONS = 2;

    constructor(
        private llm: LLMProvider,
        config?: Partial<GeneratorConfig>
    ) {
        super();
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.generators = this.initializeGenerators();
        this.isInitialized = true;
    }

    private initializeGenerators(): Map<TestType, ITestGenerator> {
        const generators: ITestGenerator[] = [
            new UnitTestGenerator(this.llm),
            new IntegrationTestGenerator(this.llm),
            new E2ETestGenerator(this.llm),
            new SnapshotTestGenerator(this.llm),
            new VisualRegressionTestGenerator(this.llm),
            new PerformanceTestGenerator(this.llm)
        ];

        return new Map(
            generators.map(generator => [generator.type, generator])
        );
    }

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
            this.validateInput(input);

            const componentName = this.extractComponentName(input.componentCode);
            const componentDir = path.dirname(input.componentPath);

            this.logAnalysisDetails(input.analysis);

            let testTypes = input.testTypes || this.detectTestTypes(input.analysis);
            // Применяем исключение
            if (input.exclude && input.exclude.length) {
                testTypes = testTypes.filter(t => !(input as any).exclude.includes(t));
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

            for (const [type, result] of results) {
                if (!result) {
                    errors.push({
                        type: type as TestType,
                        error: `Failed to generate ${type} tests`
                    });
                }
            }

            const generatedFiles = await this.saveTestFiles(
                componentDir,
                componentName,
                results
            );

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

    validateInput(input: any, schema?: any): boolean {
        if (!input) {
            console.error('❌ Input is empty');
            return false;
        }
        if (!input.componentCode) {
            console.error('❌ componentCode is required');
            return false;
        }
        if (!input.componentPath) {
            console.error('❌ componentPath is required');
            return false;
        }
        if (!input.analysis) {
            console.error('❌ analysis is required');
            return false;
        }
        return true;
    }

    private logAnalysisDetails(analysis: ComponentAnalysis): void {
        if (analysis.subComponents && analysis.subComponents.length > 0) {
            console.log(`🧩 Вложенные компоненты: ${analysis.subComponents.join(', ')}`);
        }
        if (analysis.networkCalls && analysis.networkCalls.length > 0) {
            console.log(`🌐 Сетевые вызовы: ${analysis.networkCalls.map(c => `${c.method} ${c.url}`).join(', ')}`);
        }
        if (analysis.contextUsages && analysis.contextUsages.length > 0) {
            console.log(`📦 Используемые контексты: ${analysis.contextUsages.join(', ')}`);
        }
        if (analysis.reduxSlices && analysis.reduxSlices.length > 0) {
            console.log(`🔴 Redux слайсы: ${analysis.reduxSlices.join(', ')}`);
        }
    }

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
            if (item) {
                results.set(item.type, item.result);
            }
        }
        return results;
    }

    private async generateSingleTest(
        type: TestType,
        input: TestGenerationInput
    ): Promise<{ type: TestType; result: TestGenerationOutput } | null> {
        const cacheKey = `${this.hashCode(input.componentCode)}_${type}_${this.hashCode(JSON.stringify(input.options || {}))}`;
        if (this.generationCache.has(cacheKey)) {
            console.log(`📦 Использую кеш для ${type} тестов`);
            return { type, result: this.generationCache.get(cacheKey)! };
        }

        const generator = this.generators.get(type);
        if (!generator) {
            console.warn(`⚠️ Генератор для ${type} не найден, пропускаем`);
            return null;
        }

        try {
            if (!generator.isApplicable(input.analysis)) {
                console.log(`ℹ️ Генератор ${type} не применим для этого компонента`);
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

    private async saveTestFiles(
        componentDir: string,
        componentName: string,
        results: Map<TestType, TestGenerationOutput>
    ): Promise<GeneratedFile[]> {
        const generatedFiles: GeneratedFile[] = [];
        const testsBaseDir = path.join(componentDir, this.config.outputDir!);

        if (!fs.existsSync(testsBaseDir)) {
            fs.mkdirSync(testsBaseDir, { recursive: true });
        }

        for (const [type, result] of results) {
            if (!result) continue;

            const typeDir = path.join(testsBaseDir, type);
            if (!fs.existsSync(typeDir)) {
                fs.mkdirSync(typeDir, { recursive: true });
            }

            const filePath = path.join(typeDir, result.testFileName);
            const fileContent = this.addFileHeader(result, componentName);

            fs.writeFileSync(filePath, fileContent, 'utf-8');

            const file: GeneratedFile = {
                type,
                path: filePath,
                content: fileContent,
                size: Buffer.byteLength(fileContent, 'utf-8')
            };

            generatedFiles.push(file);
            console.log(`📁 Файл сохранен: ${filePath}`);

            if (result.setupFiles) {
                await this.saveSetupFiles(typeDir, result.setupFiles);
            }
        }

        this.createTestIndexFile(testsBaseDir, results);

        return generatedFiles;
    }

    private addFileHeader(result: TestGenerationOutput, componentName: string): string {
        const header = `/**
 * ${result.description}
 * 
 * @file ${result.testFileName}
 * @description Тестирование ${componentName} 
 * @generated ${new Date().toISOString()}
 * @type {${result.testType}}
 * @testCount ${result.metadata?.testCount || 0}
 * 
 * @dependencies ${result.dependencies?.join(', ') || 'нет'}
 * @mocks ${result.mocks?.join(', ') || 'нет'}
 */

`;

        let mocks = '';
        if (result.mocks && result.mocks.length > 0) {
            mocks = `
// ============================================
// МОКИ
// ============================================
${result.mocks.map(mock => `// ${mock}`).join('\n')}
`;
        }

        let deps = '';
        if (result.dependencies && result.dependencies.length > 0) {
            deps = `
// ============================================
// ЗАВИСИМОСТИ
// ============================================
${result.dependencies.map(dep => `// npm install -D ${dep}`).join('\n')}
`;
        }

        return header + mocks + deps + '\n' + result.testCode;
    }

    private async saveSetupFiles(typeDir: string, setupFiles: string[]): Promise<void> {
        const setupDir = path.join(typeDir, '__setup__');
        if (!fs.existsSync(setupDir)) {
            fs.mkdirSync(setupDir, { recursive: true });
        }

        for (let i = 0; i < setupFiles.length; i++) {
            const fileName = `setup-${i + 1}.ts`;
            const filePath = path.join(setupDir, fileName);
            fs.writeFileSync(filePath, setupFiles[i], 'utf-8');
            console.log(`🔧 Setup файл сохранен: ${filePath}`);
        }
    }

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
 * Тесты для компонента
 * Сгенерировано автоматически
 * 
 * @generated ${new Date().toISOString()}
 * @types ${Array.from(results.keys()).join(', ')}
 */

${exports.join('\n')}
`;

        const indexPath = path.join(testsBaseDir, 'index.ts');
        fs.writeFileSync(indexPath, indexContent, 'utf-8');
        console.log(`📄 Index файл создан: ${indexPath}`);
    }

    private combineTestResults(results: Map<TestType, TestGenerationOutput>): string {
        const parts: string[] = [];

        for (const [type, result] of results) {
            if (!result) continue;
            parts.push(`// ============================================`);
            parts.push(`// ${type.toUpperCase()} TESTS`);
            parts.push(`// Файл: ${result.testFileName}`);
            parts.push(`// Описание: ${result.description}`);
            parts.push(`// ============================================`);
            parts.push(result.testCode);
            parts.push('');
        }

        return parts.join('\n');
    }

    private extractAllTestCases(results: Map<TestType, TestGenerationOutput>): string[] {
        const allTestCases: string[] = [];

        for (const [type, result] of results) {
            if (!result) continue;
            const testCases = this.extractTestCases(result.testCode);
            allTestCases.push(...testCases.map(tc => `[${type.toUpperCase()}] ${tc}`));
        }

        return allTestCases;
    }

    private extractTestCases(testCode: string): string[] {
        const testCases: string[] = [];
        const lines = testCode.split('\n');

        let currentDescribe = '';

        for (const line of lines) {
            const describeMatch = line.match(/describe\(['"]([^'"]+)['"],/);
            if (describeMatch) {
                currentDescribe = describeMatch[1];
            }

            const itMatch = line.match(/(?:it|test)\(['"]([^'"]+)['"],/);
            if (itMatch) {
                const testName = currentDescribe ? `[${currentDescribe}] ${itMatch[1]}` : itMatch[1];
                testCases.push(testName);
            }
        }

        return testCases.length > 0 ? testCases : ['[Рендеринг] Базовый рендеринг'];
    }

    private extractComponentName(code: string): string {
        const patterns = [
            /export\s+default\s+(?:function|class|const)\s+(\w+)/,
            /export\s+(?:function|class|const)\s+(\w+)/,
            /function\s+(\w+)\s*\(/,
            /const\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function)/
        ];

        for (const pattern of patterns) {
            const match = code.match(pattern);
            if (match) return match[1];
        }

        return 'Component';
    }

    private getFallbackResult(
        componentPath: string,
        startTime: number,
        analysis: ComponentAnalysis
    ): TestGenerationResult {
        const componentName = path.basename(componentPath, path.extname(componentPath));
        const fallbackCode = this.generateFallbackCode(componentName);

        const file: GeneratedFile = {
            type: TestType.UNIT,
            path: path.join(
                path.dirname(componentPath),
                '__tests__',
                'unit',
                `${componentName}.unit.test.tsx`
            ),
            content: fallbackCode,
            size: Buffer.byteLength(fallbackCode, 'utf-8')
        };

        const defaultPlan: TestPlan = {
            componentType: analysis.componentType || 'functional',
            testPriority: 'low',
            requiredTests: ['Базовый рендеринг'],
            dependencies: analysis.dependencies || [],
            estimatedTime: '5 минут',
            riskAreas: ['Сгенерировано в fallback режиме']
        };

        return {
            plan: defaultPlan,
            analysis: analysis,
            filePath: componentPath,
            testCases: ['[Рендеринг] Базовый рендеринг'],
            testCode: fallbackCode,
            generatedFiles: [file],
            summary: {
                totalFiles: 1,
                totalTestCases: 1,
                typesGenerated: [TestType.UNIT],
                executionTime: Date.now() - startTime,
                errors: [{ type: TestType.UNIT, error: 'Fallback generated due to error' }]
            }
        };
    }

    private generateFallbackCode(componentName: string): string {
        return `import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ${componentName} from '../${componentName}';

describe('${componentName}', () => {
    test('should render without errors', () => {
        render(<${componentName} />);
        expect(screen.getByRole('main')).toBeInTheDocument();
    });
});`;
    }

    getAvailableGenerators(): Array<{ type: TestType; name: string; description: string }> {
        const result: Array<{ type: TestType; name: string; description: string }> = [];

        for (const [type, generator] of this.generators) {
            result.push({
                type,
                name: generator.name,
                description: generator.description
            });
        }

        return result;
    }

    supportsTestType(type: TestType): boolean {
        return this.generators.has(type);
    }

    getGeneratorInfo(type: TestType): { name: string; description: string } | null {
        const generator = this.generators.get(type);
        if (!generator) return null;

        return {
            name: generator.name,
            description: generator.description
        };
    }

    clearAllCaches(): void {
        for (const [, generator] of this.generators) {
            if (generator instanceof BaseTestGenerator) {
                generator.clearCache();
            }
        }
        this.generationCache.clear();
        console.log('🧹 Кэш всех генераторов очищен');
    }
}