// src/core/agent/react-test-agent.ts
import { GigaChatProvider } from '../llm/gigachat-provider';
import { ComponentAnalyzerTool } from '../../tools/component-analyzer-tool';
import { TestPlanner } from '../../planners/test-planner';
import { TestExecutor } from '../../executors/test-executor';
import { TestGeneratorTool } from '../../tools/testGenerator/index';
import {
    AgentConfig,
    AgentMemory,
    ComponentAnalysis,
    TestPlan,
    Planner,
    Executor,
    TestExecution,
    ComponentAnalysisWithMemory,
    LLMProviderType,
    LLMProvider
} from '../../types/agent';
import { env } from "../../env";
import { TestGenerationResult, TestType } from "../../tools/testGenerator/types";

export class ReactTestAgent {
    protected planner: Planner;
    protected testGenerator: TestGeneratorTool;
    protected llm: LLMProvider;
    private executor: Executor;
    protected memory: AgentMemory;
    private componentAnalyzer: ComponentAnalyzerTool;
    private providerType: LLMProviderType;

    constructor(protected config: AgentConfig) {
        this.providerType = config.providerType || 'gigachat';
        this.llm = this.createLLMProvider(config);

        this.planner = new TestPlanner(this.llm);
        this.executor = new TestExecutor();
        this.componentAnalyzer = new ComponentAnalyzerTool(this.llm);
        this.testGenerator = new TestGeneratorTool(this.llm);

        this.memory = {
            testHistory: [],
            componentAnalysis: new Map(),
            commonPatterns: [],
            errorPatterns: []
        };
    }

    /**
     * Создает LLM провайдер на основе конфигурации
     */
    private createLLMProvider(options: any): LLMProvider {
        const providerType = options.providerType || env.DEFAULT_PROVIDER || 'gigachat';
        const clientId = options.clientId || env.GIGACHAT_CLIENT_ID;
        const clientSecret = options.clientSecret || env.GIGACHAT_CLIENT_SECRET;

        console.log(`🔧 Using provider: ${providerType}`);

        switch (providerType) {
            case 'gigachat':
                if (!clientId || !clientSecret) {
                    throw new Error('GigaChat requires clientId and clientSecret');
                }
                return new GigaChatProvider(
                    clientId,
                    clientSecret,
                    {
                        temperature: options.temperature || 0.3,
                        maxTokens: options.maxTokens || 4000
                    }
                );
            default:
                throw new Error(`Unsupported provider: ${providerType}`);
        }
    }

    /**
     * Проверяет инициализацию провайдера
     */
    async initialize(): Promise<void> {
        try {
            if (this.providerType === 'gigachat' && this.llm instanceof GigaChatProvider) {
                const isConnected = await this.llm.testConnection();
                if (!isConnected) {
                    throw new Error('GigaChat connection failed');
                }
                console.log('✅ GigaChat provider initialized successfully');
            } else {
                console.log(`✅ ${this.providerType} provider initialized successfully`);
            }
        } catch (error) {
            console.error('❌ Provider initialization failed:', error);
            throw error;
        }
    }

    /**
     * Возвращает тип провайдера
     */
    getProviderType(): LLMProviderType {
        return this.providerType;
    }

    /**
     * Проверяет, инициализирован ли агент
     */
    isInitialized(): boolean {
        return this.llm !== null && this.llm !== undefined;
    }

    /**
     * Переключает провайдера во время работы
     */
    switchProvider(providerType: LLMProviderType): void {
        if (this.providerType === providerType) {
            return;
        }

        this.providerType = providerType;
        this.llm = this.createLLMProvider(this.config);
        console.log(`🔄 Switched to ${providerType} provider`);
    }

    /**
     * Анализирует React компонент и возвращает его структуру
     */
    async analyzeComponent(componentCode: string): Promise<ComponentAnalysis> {
        console.log('🔍 Анализирую компонент...');

        try {
            this.validateComponentCode(componentCode);

            const analysis = await this.componentAnalyzer.execute({
                code: componentCode,
                componentPath: 'unknown'
            });

            const result: ComponentAnalysis = {
                props: Array.isArray(analysis?.props) ? analysis.props : [],
                states: Array.isArray(analysis?.states) ? analysis.states : [],
                effects: Array.isArray(analysis?.effects) ? analysis.effects : [],
                events: Array.isArray(analysis?.events) ? analysis.events : [],
                dependencies: Array.isArray(analysis?.dependencies) ? analysis.dependencies : [],
                complexity: analysis?.complexity || 'medium',
                componentType: analysis?.componentType || 'functional',
                subComponents: analysis?.subComponents || [],
                externalServices: analysis?.externalServices || [],
                contextUsages: analysis?.contextUsages || [],
                reduxSlices: analysis?.reduxSlices || [],
                networkCalls: analysis?.networkCalls || [],
                localImports: analysis?.localImports || []
            };

            console.log(`✅ Компонент проанализирован. Сложность: ${result.complexity}`);
            console.log(`   📊 Пропсы: ${result.props.length}, Состояния: ${result.states.length}`);
            return result;
        } catch (error) {
            console.error('❌ Ошибка анализа компонента:', error);
            return {
                props: [],
                states: [],
                effects: [],
                events: [],
                dependencies: [],
                complexity: 'medium',
                componentType: 'functional'
            };
        }
    }

    /**
     * Генерирует полный набор тестов для компонента
     * @param componentCode - код компонента
     * @param componentPath - путь к компоненту
     * @param options - опции генерации (testTypes, exclude)
     */
    async generateCompleteTests(
        componentCode: string,
        componentPath: string,
        options?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<TestGenerationResult> {
        console.log(`🚀 Запускаю генерацию тестов для: ${componentPath} (${this.providerType})`);

        const startTime = Date.now();

        try {
            const analysis = await this.analyzeComponent(componentCode);
            const plan = await this.planner.plan(componentCode, analysis);

            const result = await this.testGenerator.execute({
                componentCode,
                componentPath,
                analysis,
                framework: `${this.config.testFramework} + ${this.config.testingLibrary}`,
                testTypes: options?.testTypes,
                exclude: options?.exclude,
            });

            const duration = Date.now() - startTime;

            this.recordTestExecution({
                componentPath,
                timestamp: new Date(),
                input: {
                    code: componentCode,
                    config: this.config
                },
                output: {
                    testCode: result.testCode,
                    testCases: result.testCases,
                    plan: result.plan
                },
                result: {
                    success: true,
                    duration,
                    coverage: this.estimateCoverage(result.testCode),
                    testsPassed: result.testCases.length,
                    testsFailed: 0
                }
            });

            this.memory.componentAnalysis.set(componentPath, {
                ...analysis,
                hash: this.generateCodeHash(componentCode)
            } as ComponentAnalysisWithMemory);

            console.log(`✅ Тесты сгенерированы для: ${componentPath} (${duration}ms)`);

            return {
                plan: result.plan,
                analysis,
                testCases: result.testCases,
                testCode: result.testCode,
                filePath: this.getTestFilePath(componentPath),
                generatedFiles: result.generatedFiles,
                summary: result.summary
            };

        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`❌ Ошибка генерации тестов для ${componentPath}:`, error);

            this.recordTestExecution({
                componentPath,
                timestamp: new Date(),
                input: {
                    code: componentCode,
                    config: this.config
                },
                output: {
                    testCode: '',
                    testCases: [],
                    plan: {} as TestPlan
                },
                result: {
                    success: false,
                    duration,
                    coverage: 0,
                    testsPassed: 0,
                    testsFailed: 0,
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            });

            throw error;
        }
    }

    /**
     * Генерирует hash для кода компонента
     */
    generateCodeHash(code: string): string {
        let hash = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Генерирует тесты для нескольких компонентов
     */
    async generateTestsForProject(
        components: Array<{ code: string; path: string }>,
        options?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<Array<TestGenerationResult & { status: string }>> {
        console.log(`📦 Начинаю пакетную генерацию тестов для ${components.length} компонентов (${this.providerType})`);

        const results: Array<TestGenerationResult & { status: string }> = [];

        for (const component of components) {
            try {
                const result = await this.generateCompleteTests(component.code, component.path, options);
                results.push({ ...result, status: 'success' });
                console.log(`✅ Успешно: ${component.path}`);
            } catch (error) {
                results.push({
                    component: component.path,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    status: 'failed',
                    plan: {} as TestPlan,
                    analysis: {} as ComponentAnalysis,
                    testCases: [],
                    testCode: '',
                    filePath: '',
                    generatedFiles: [],
                    summary: {
                        totalFiles: 0,
                        totalTestCases: 0,
                        typesGenerated: [],
                        executionTime: 0,
                        errors: [{ type: 'unit' as any, error: error instanceof Error ? error.message : 'Unknown error' }]
                    }
                } as any);
                console.log(`❌ Ошибка: ${component.path}`);
            }
        }

        const successCount = results.filter(r => r.status === 'success').length;
        const errorCount = results.filter(r => r.status === 'failed').length;

        console.log(`📊 Пакетная генерация завершена. Успешно: ${successCount}, Ошибок: ${errorCount}`);

        return results;
    }

    /**
     * Возвращает путь для файла тестов
     */
    getTestFilePath(componentPath: string): string {
        const dir = componentPath.split('/').slice(0, -1).join('/');
        const filename = componentPath.split('/').pop() || '';
        const baseName = filename.replace(/\.[^/.]+$/, '');
        const extension = filename.split('.').pop() || 'js';

        const testDir = `${dir}/__tests__`;
        const testName = `${baseName}.test.${extension}`;

        return `${testDir}/${testName}`;
    }

    /**
     * Возвращает текущую память агента
     */
    getMemory(): AgentMemory {
        return this.memory;
    }

    /**
     * Очищает память агента
     */
    clearMemory(): void {
        this.memory = {
            testHistory: [],
            componentAnalysis: new Map(),
            commonPatterns: [],
            errorPatterns: []
        };
        console.log('🧹 Память агента очищена');
    }

    /**
     * Генерирует отчет о работе агента
     */
    generateReport() {
        const total = this.memory.testHistory.length;
        const successful = this.memory.testHistory.filter(entry =>
            !entry.result || entry.result.success
        ).length;

        const componentsByComplexity = this.analyzeComponentsByComplexity();
        const recentActivity = this.getRecentActivity();

        return {
            summary: {
                totalComponents: total,
                successfulTests: successful,
                successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : '0%',
                componentsAnalyzed: this.memory.componentAnalysis.size,
                provider: this.providerType
            },
            complexityBreakdown: componentsByComplexity,
            recentActivity: recentActivity,
            components: Array.from(this.memory.componentAnalysis.keys()),
            patternsDiscovered: this.memory.commonPatterns.length,
            commonErrors: this.memory.errorPatterns.length
        };
    }

    /**
     * Генерирует детализированный отчет
     */
    getDetailedReport() {
        const report = this.generateReport();

        return {
            ...report,
            providerInfo: {
                type: this.providerType,
                config: {
                    temperature: this.config.temperature,
                    maxTokens: this.config.maxTokens,
                    framework: this.config.testFramework,
                    library: this.config.testingLibrary
                }
            },
            testHistory: this.memory.testHistory.map(entry => ({
                component: entry.componentPath,
                timestamp: entry.timestamp.toISOString(),
                testCases: entry.output.testCases,
                success: entry.result.success,
                errors: entry.result.error ? [entry.result.error] : [],
                duration: entry.result.duration
            })),
            componentAnalysis: Array.from(this.memory.componentAnalysis.entries()).map(([path, analysis]) => ({
                path,
                complexity: analysis.complexity,
                props: analysis.props.length,
                states: analysis.states.length,
                type: analysis.componentType,
                dependencies: analysis.dependencies
            }))
        };
    }

    /**
     * Экспортирует отчет в различных форматах
     */
    exportReport(format: 'json' | 'text' = 'text'): string | object {
        const report = this.getDetailedReport();

        if (format === 'json') {
            return report;
        }

        return `
React Test Agent Report
=======================

Provider: ${this.providerType}

Summary:
--------
• Total Components: ${report.summary.totalComponents}
• Successful Tests: ${report.summary.successfulTests}
• Success Rate: ${report.summary.successRate}
• Components Analyzed: ${report.summary.componentsAnalyzed}

Complexity Breakdown:
--------------------
• Low: ${report.complexityBreakdown.low}
• Medium: ${report.complexityBreakdown.medium} 
• High: ${report.complexityBreakdown.high}

Recent Activity:
---------------
${report.recentActivity.map(activity =>
            `• ${activity.component} - ${activity.success ? '✅' : '❌'} (${activity.duration}ms)`
        ).join('\n')}

Patterns & Errors:
-----------------
• Patterns Discovered: ${report.patternsDiscovered}
• Common Errors: ${report.commonErrors}

Components Analyzed:
------------------
${report.components.map(comp => `• ${comp}`).join('\n')}
    `.trim();
    }

    /**
     * Возвращает историю тестирования для конкретного компонента
     */
    getComponentTestHistory(componentPath: string): TestExecution[] {
        return this.memory.testHistory.filter(entry =>
            entry.componentPath === componentPath
        );
    }

    /**
     * Возвращает анализ конкретного компонента
     */
    getComponentAnalysis(componentPath: string): ComponentAnalysis | undefined {
        const analysis = this.memory.componentAnalysis.get(componentPath);
        if (analysis) {
            const { hash, testHistory, ...baseAnalysis } = analysis;
            return baseAnalysis;
        }
        return undefined;
    }

    /**
     * Анализирует компоненты по сложности
     */
    private analyzeComponentsByComplexity(): { low: number; medium: number; high: number } {
        const breakdown = {
            low: 0,
            medium: 0,
            high: 0
        };

        this.memory.componentAnalysis.forEach(analysis => {
            breakdown[analysis.complexity] = (breakdown[analysis.complexity] || 0) + 1;
        });

        return breakdown;
    }

    /**
     * Проверяет, был ли уже проанализирован компонент
     */
    hasComponentBeenAnalyzed(componentPath: string): boolean {
        return this.memory.componentAnalysis.has(componentPath);
    }

    /**
     * Возвращает текущую конфигурацию агента
     */
    getConfig(): AgentConfig {
        return { ...this.config };
    }

    /**
     * Возвращает количество успешных тестов
     */
    getSuccessRate(): number {
        const total = this.memory.testHistory.length;
        if (total === 0) return 0;

        const successful = this.memory.testHistory.filter(entry =>
            !entry.result || entry.result.success
        ).length;

        return successful / total;
    }

    /**
     * Возвращает статистику по сложности компонентов
     */
    getComplexityStats(): { low: number; medium: number; high: number } {
        return this.analyzeComponentsByComplexity();
    }

    /**
     * Записывает выполнение теста в память
     */
    protected recordTestExecution(execution: Omit<TestExecution, 'id'>): void {
        const executionWithId: TestExecution = {
            ...execution,
            id: this.generateExecutionId()
        };

        this.memory.testHistory.push(executionWithId);
    }

    /**
     * Генерирует ID для выполнения теста
     */
    private generateExecutionId(): string {
        return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Возвращает последнюю активность
     */
    private getRecentActivity() {
        const recentTests = this.memory.testHistory
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5);

        return recentTests.map(entry => ({
            component: entry.componentPath,
            timestamp: entry.timestamp.toISOString(),
            success: entry.result.success,
            duration: entry.result.duration
        }));
    }

    /**
     * Оценивает покрытие тестов на основе эвристики
     */
    protected estimateCoverage(testCode: string): number {
        const testCount = (testCode.match(/test\(/g) || []).length;
        const itCount = (testCode.match(/it\(/g) || []).length;
        const describeCount = (testCode.match(/describe\(/g) || []).length;

        const totalTests = testCount + itCount;
        if (totalTests === 0) return 0;

        const baseCoverage = Math.min(100, totalTests * 15 + describeCount * 5);

        let bonus = 0;
        if (testCode.includes('fireEvent') || testCode.includes('userEvent')) bonus += 10;
        if (testCode.includes('async') || testCode.includes('await')) bonus += 10;
        if (testCode.includes('mock') || testCode.includes('jest.mock')) bonus += 5;

        return Math.min(100, baseCoverage + bonus);
    }

    /**
     * Валидирует код компонента перед анализом
     */
    private validateComponentCode(code: string): boolean {
        if (!code || code.trim().length === 0) {
            throw new Error('Component code is empty');
        }

        if (!code.includes('React') && !code.includes('react')) {
            console.warn('⚠️  Component code may not be a React component');
        }

        return true;
    }
}