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
    LLMProvider,
} from '../../types/agent';
import { env } from '../../env';
import { TestGenerationResult, TestType } from '../../tools/testGenerator/types';

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
            errorPatterns: [],
        };
    }

    // Фабрика LLM-провайдера
    private createLLMProvider(options: any): LLMProvider {
        const providerType = options.providerType || env.DEFAULT_PROVIDER || 'gigachat';
        const clientId = options.clientId || env.GIGACHAT_CLIENT_ID;
        const clientSecret = options.clientSecret || env.GIGACHAT_CLIENT_SECRET;

        console.log(`🔧 Используем провайдера: ${providerType}`);

        switch (providerType) {
            case 'gigachat':
                if (!clientId || !clientSecret) {
                    throw new Error('Для GigaChat нужны clientId и clientSecret');
                }
                return new GigaChatProvider(clientId, clientSecret, {
                    temperature: options.temperature || 0.3,
                    maxTokens: options.maxTokens || 4000,
                });
            default:
                throw new Error(`Неизвестный провайдер: ${providerType}`);
        }
    }

    async initialize(): Promise<void> {
        try {
            if (this.providerType === 'gigachat' && this.llm instanceof GigaChatProvider) {
                const ok = await this.llm.testConnection();
                if (!ok) throw new Error('GigaChat недоступен');
                console.log('✅ Провайдер GigaChat инициализирован');
            } else {
                console.log(`✅ Провайдер ${this.providerType} инициализирован`);
            }
        } catch (error) {
            console.error('❌ Не удалось инициализировать провайдера:', error);
            throw error;
        }
    }

    getProviderType(): LLMProviderType {
        return this.providerType;
    }

    isInitialized(): boolean {
        return this.llm !== null && this.llm !== undefined;
    }

    switchProvider(providerType: LLMProviderType): void {
        if (this.providerType === providerType) return;
        this.providerType = providerType;
        this.llm = this.createLLMProvider(this.config);
        console.log(`🔄 Переключились на провайдера ${providerType}`);
    }

    // Анализ компонента через AST-инструмент с нормализацией полей
    async analyzeComponent(componentCode: string): Promise<ComponentAnalysis> {
        console.log('🔍 Анализирую компонент...');

        try {
            this.validateComponentCode(componentCode);

            const analysis = await this.componentAnalyzer.execute({
                code: componentCode,
                componentPath: 'unknown',
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
                localImports: analysis?.localImports || [],
            };

            console.log(`✅ Анализ готов. Сложность: ${result.complexity}`);
            console.log(`   📊 Пропсов: ${result.props.length}, состояний: ${result.states.length}`);
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
                componentType: 'functional',
            };
        }
    }

    async generateCompleteTests(
        componentCode: string,
        componentPath: string,
        options?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<TestGenerationResult> {
        console.log(`🚀 Генерация тестов для ${componentPath} (${this.providerType})`);

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
                input: { code: componentCode, config: this.config },
                output: {
                    testCode: result.testCode,
                    testCases: result.testCases,
                    plan: result.plan,
                },
                result: {
                    success: true,
                    duration,
                    coverage: this.estimateCoverage(result.testCode),
                    testsPassed: result.testCases.length,
                    testsFailed: 0,
                },
            });

            this.memory.componentAnalysis.set(componentPath, {
                ...analysis,
                hash: this.generateCodeHash(componentCode),
            } as ComponentAnalysisWithMemory);

            console.log(`✅ Тесты сгенерированы за ${duration}мс`);

            return {
                plan: result.plan,
                analysis,
                testCases: result.testCases,
                testCode: result.testCode,
                filePath: this.getTestFilePath(componentPath),
                generatedFiles: result.generatedFiles,
                summary: result.summary,
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`❌ Ошибка генерации тестов для ${componentPath}:`, error);

            this.recordTestExecution({
                componentPath,
                timestamp: new Date(),
                input: { code: componentCode, config: this.config },
                output: { testCode: '', testCases: [], plan: {} as TestPlan },
                result: {
                    success: false,
                    duration,
                    coverage: 0,
                    testsPassed: 0,
                    testsFailed: 0,
                    error: error instanceof Error ? error.message : 'Неизвестная ошибка',
                },
            });

            throw error;
        }
    }

    generateCodeHash(code: string): string {
        let hash = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    // Пакетная генерация для списка компонентов
    async generateTestsForProject(
        components: Array<{ code: string; path: string }>,
        options?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<Array<TestGenerationResult & { status: string }>> {
        console.log(`📦 Пакетная генерация для ${components.length} компонентов`);
        const results: Array<TestGenerationResult & { status: string }> = [];

        for (const component of components) {
            try {
                const result = await this.generateCompleteTests(component.code, component.path, options);
                results.push({ ...result, status: 'success' });
                console.log(`✅ Успешно: ${component.path}`);
            } catch (error) {
                results.push({
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Неизвестная ошибка',
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
                        errors: [{
                            type: 'unit' as any,
                            error: error instanceof Error ? error.message : 'Неизвестная ошибка',
                        }],
                    },
                } as any);
                console.log(`❌ Ошибка: ${component.path}`);
            }
        }

        const successCount = results.filter(r => r.status === 'success').length;
        const errorCount = results.filter(r => r.status === 'failed').length;
        console.log(`📊 Завершено. Успешно: ${successCount}, ошибок: ${errorCount}`);
        return results;
    }

    // Путь для сгенерированного теста (рядом с компонентом, в __tests__)
    getTestFilePath(componentPath: string): string {
        const dir = componentPath.split('/').slice(0, -1).join('/');
        const filename = componentPath.split('/').pop() || '';
        const baseName = filename.replace(/\.[^/.]+$/, '');
        const extension = filename.split('.').pop() || 'js';
        return `${dir}/__tests__/${baseName}.test.${extension}`;
    }

    getMemory(): AgentMemory {
        return this.memory;
    }

    clearMemory(): void {
        this.memory = {
            testHistory: [],
            componentAnalysis: new Map(),
            commonPatterns: [],
            errorPatterns: [],
        };
        console.log('🧹 Память агента очищена');
    }

    generateReport() {
        const total = this.memory.testHistory.length;
        const successful = this.memory.testHistory.filter(entry =>
            !entry.result || entry.result.success
        ).length;

        return {
            summary: {
                totalComponents: total,
                successfulTests: successful,
                successRate: total > 0 ? ((successful / total) * 100).toFixed(2) + '%' : '0%',
                componentsAnalyzed: this.memory.componentAnalysis.size,
                provider: this.providerType,
            },
            complexityBreakdown: this.analyzeComponentsByComplexity(),
            recentActivity: this.getRecentActivity(),
            components: Array.from(this.memory.componentAnalysis.keys()),
            patternsDiscovered: this.memory.commonPatterns.length,
            commonErrors: this.memory.errorPatterns.length,
        };
    }

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
                    library: this.config.testingLibrary,
                },
            },
            testHistory: this.memory.testHistory.map(entry => ({
                component: entry.componentPath,
                timestamp: entry.timestamp.toISOString(),
                testCases: entry.output.testCases,
                success: entry.result.success,
                errors: entry.result.error ? [entry.result.error] : [],
                duration: entry.result.duration,
            })),
            componentAnalysis: Array.from(this.memory.componentAnalysis.entries()).map(([path, analysis]) => ({
                path,
                complexity: analysis.complexity,
                props: analysis.props.length,
                states: analysis.states.length,
                type: analysis.componentType,
                dependencies: analysis.dependencies,
            })),
        };
    }

    exportReport(format: 'json' | 'text' = 'text'): string | object {
        const report = this.getDetailedReport();
        if (format === 'json') return report;

        return `
Отчёт React Test Agent
======================

Провайдер: ${this.providerType}

Сводка:
-------
• Всего компонентов: ${report.summary.totalComponents}
• Успешных тестов: ${report.summary.successfulTests}
• Процент успеха: ${report.summary.successRate}
• Проанализировано: ${report.summary.componentsAnalyzed}

По сложности:
-------------
• Low: ${report.complexityBreakdown.low}
• Medium: ${report.complexityBreakdown.medium}
• High: ${report.complexityBreakdown.high}

Последняя активность:
---------------------
${report.recentActivity.map(a => `• ${a.component} — ${a.success ? '✅' : '❌'} (${a.duration}мс)`).join('\n')}

Паттерны и ошибки:
------------------
• Паттернов: ${report.patternsDiscovered}
• Частых ошибок: ${report.commonErrors}

Проанализированные компоненты:
------------------------------
${report.components.map(comp => `• ${comp}`).join('\n')}
`.trim();
    }

    getComponentTestHistory(componentPath: string): TestExecution[] {
        return this.memory.testHistory.filter(entry => entry.componentPath === componentPath);
    }

    getComponentAnalysis(componentPath: string): ComponentAnalysis | undefined {
        const analysis = this.memory.componentAnalysis.get(componentPath);
        if (!analysis) return undefined;
        const { hash: _hash, testHistory: _history, ...base } = analysis;
        return base;
    }

    private analyzeComponentsByComplexity(): { low: number; medium: number; high: number } {
        const breakdown = { low: 0, medium: 0, high: 0 };
        this.memory.componentAnalysis.forEach(analysis => {
            breakdown[analysis.complexity] = (breakdown[analysis.complexity] || 0) + 1;
        });
        return breakdown;
    }

    hasComponentBeenAnalyzed(componentPath: string): boolean {
        return this.memory.componentAnalysis.has(componentPath);
    }

    getConfig(): AgentConfig {
        return { ...this.config };
    }

    getSuccessRate(): number {
        const total = this.memory.testHistory.length;
        if (total === 0) return 0;
        const successful = this.memory.testHistory.filter(entry => !entry.result || entry.result.success).length;
        return successful / total;
    }

    getComplexityStats(): { low: number; medium: number; high: number } {
        return this.analyzeComponentsByComplexity();
    }

    protected recordTestExecution(execution: Omit<TestExecution, 'id'>): void {
        const executionWithId: TestExecution = {
            ...execution,
            id: this.generateExecutionId(),
        };
        this.memory.testHistory.push(executionWithId);
    }

    private generateExecutionId(): string {
        return `exec_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    }

    private getRecentActivity() {
        return [...this.memory.testHistory]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5)
            .map(entry => ({
                component: entry.componentPath,
                timestamp: entry.timestamp.toISOString(),
                success: entry.result.success,
                duration: entry.result.duration,
            }));
    }

    // Грубая эвристика оценки покрытия по содержимому тестов
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

    private validateComponentCode(code: string): boolean {
        if (!code || code.trim().length === 0) {
            throw new Error('Код компонента пуст');
        }
        if (!code.includes('React') && !code.includes('react')) {
            console.warn('⚠️ Код не похож на React-компонент');
        }
        return true;
    }
}