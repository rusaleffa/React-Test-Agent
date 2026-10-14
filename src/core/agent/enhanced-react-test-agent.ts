// src/core/agent/enhanced-react-test-agent.ts
import { ReactTestAgent } from './react-test-agent';
import { MemoryManager } from '../memory/memory-manager';
import {
    AgentConfig,
    TestExecution,
    ComponentAnalysis,
    TestPlan,
    ComponentAnalysisWithMemory
} from '../../types/agent';
import { TestGenerationResult, TestType } from '../../tools/testGenerator/types';

export class EnhancedReactTestAgent extends ReactTestAgent {
    private memoryManager: MemoryManager;
    private memoryInitialized: boolean = false;
    private currentComponentPath: string = '';

    constructor(config: AgentConfig) {
        super(config);
        this.memoryManager = new MemoryManager();
        this.initializeEnhancedMemory();
    }

    /**
     * Инициализирует enhanced поля памяти
     */
    private initializeEnhancedMemory(): void {
        this.memory.patterns = {
            testPatterns: [],
            errorPatterns: [],
            bestPractices: [],
            antiPatterns: []
        };
        this.memory.performance = {
            averageGenerationTime: 0,
            successRate: 0,
            coverageTrend: [],
            componentComplexityCorrelation: {},
            toolUsage: {}
        };
        this.memory.projectContext = {
            techStack: [],
            testingPreferences: {},
            commonPatterns: []
        };
        this.memory.cache = {
            componentAnalysis: new Map(),
            testPatterns: new Map(),
            errorPatterns: new Map()
        };
    }

    /**
     * Инициализирует память агента
     */
    async initialize(): Promise<void> {
        if (this.memoryInitialized) {
            return;
        }

        try {
            console.log('🔄 Initializing EnhancedReactTestAgent...');
            await this.memoryManager.initialize();
            await this.syncMemoryWithManager();
            this.memoryInitialized = true;
            console.log('✅ EnhancedReactTestAgent initialized with memory management');
        } catch (error) {
            console.error('❌ Failed to initialize EnhancedReactTestAgent:', error);
            this.memoryInitialized = true;
        }
    }

    /**
     * Синхронизирует память агента с менеджером памяти
     */
    private async syncMemoryWithManager(): Promise<void> {
        const managerMemory = await this.memoryManager.loadMemory();

        if (managerMemory.patterns) {
            this.memory.patterns = managerMemory.patterns;
        }
        if (managerMemory.performance) {
            this.memory.performance = managerMemory.performance;
        }
        if (managerMemory.projectContext) {
            this.memory.projectContext = managerMemory.projectContext;
        }
        if (managerMemory.cache) {
            this.memory.cache = managerMemory.cache;
        }
    }

    /**
     * Генерирует расширенный отчет
     */
    generateEnhancedReport() {
        const baseReport = super.generateReport();

        return {
            ...baseReport,
            memory: {
                testExecutions: this.memoryManager.getTestHistory().length,
                cachedComponents: this.memory.cache?.componentAnalysis?.size || 0,
                performance: this.memory.performance!,
                projectTechStack: this.memory.projectContext?.techStack || []
            },
            recommendations: this.generateRecommendations(),
            trends: this.analyzeTrends(),
            memoryStats: {
                initialized: this.memoryInitialized,
                cacheSize: this.memory.cache?.componentAnalysis?.size || 0,
                patternsCount: this.memory.patterns ?
                    this.memory.patterns.testPatterns.length + this.memory.patterns.errorPatterns.length : 0
            }
        };
    }

    /**
     * Проверяет, инициализирован ли агент
     */
    isInitialized(): boolean {
        return this.memoryInitialized;
    }

    /**
     * Получает отчет о производительности
     */
    async getPerformanceReport() {
        if (!this.memoryInitialized) {
            await this.initialize();
        }
        return this.memoryManager.getPerformanceMetrics();
    }

    /**
     * Получает контекст проекта
     */
    async getProjectContext() {
        if (!this.memoryInitialized) {
            await this.initialize();
        }
        return this.memoryManager.getProjectContext();
    }

    /**
     * Обновляет контекст проекта
     */
    async updateProjectContext(updates: any) {
        if (!this.memoryInitialized) {
            await this.initialize();
        }
        return this.memoryManager.updateProjectContext(updates);
    }

    /**
     * Получает историю тестов
     */
    async getTestHistory() {
        if (!this.memoryInitialized) {
            await this.initialize();
        }
        return this.memoryManager.getTestHistory();
    }

    /**
     * Очищает память агента
     */
    async clearMemory(): Promise<void> {
        if (!this.memoryInitialized) {
            await this.initialize();
        }

        await this.memoryManager.clear();
        super.clearMemory();
        console.log('🧹 Enhanced память агента очищена');
    }

    /**
     * Получает все проанализированные компоненты
     */
    async getAllComponents() {
        if (!this.memoryInitialized) {
            await this.initialize();
        }
        return this.memoryManager.getAllComponents();
    }

    /**
     * Генерирует полный набор тестов для компонента с использованием памяти
     * @param componentCode - код компонента
     * @param componentPath - путь к компоненту
     * @param options - опции генерации (testTypes, exclude)
     */
    async generateCompleteTests(
        componentCode: string,
        componentPath: string,
        options?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<TestGenerationResult> {
        this.currentComponentPath = componentPath;

        if (!this.memoryInitialized) {
            await this.initialize();
        }

        console.log(`🚀 Запускаю enhanced генерацию тестов для: ${componentPath}`);

        if (this.memoryManager.isCacheValid(componentPath)) {
            console.log(`📁 Использую кэшированный анализ для: ${componentPath}`);
            const cached = this.memoryManager.getCachedAnalysis(componentPath);
            if (cached) {
                console.log(`🎯 Найден кэшированный анализ (возраст: ${this.getCacheAge(cached.timestamp)}ms)`);
            }
        }

        const startTime = Date.now();

        try {
            const similarComponents = await this.memoryManager.findSimilarComponents(componentCode);

            const analysis = await this.analyzeComponent(componentCode);
            const bestPractices = this.memoryManager.getBestPractices(analysis.componentType);
            const commonErrors = this.memoryManager.getCommonErrors(analysis.complexity);

            const memoryContext = this.buildContextFromMemory(
                similarComponents,
                bestPractices,
                commonErrors
            );

            console.log(`🧠 Использую контекст из ${similarComponents.length} похожих компонентов`);

            const plan = await this.generateEnhancedPlan(componentCode, analysis, memoryContext);

            const result = await this.generateEnhancedTests(
                componentCode,
                analysis,
                plan,
                memoryContext,
                options
            );

            const duration = Date.now() - startTime;

            const fullResult: TestGenerationResult = {
                plan: result.plan,
                analysis: result.analysis,
                testCases: result.testCases,
                testCode: result.testCode,
                filePath: this.getTestFilePath(componentPath),
                generatedFiles: result.generatedFiles,
                summary: result.summary
            };

            await this.recordSuccessfulExecution(
                componentCode,
                componentPath,
                fullResult,
                duration
            );

            this.memory.componentAnalysis.set(componentPath, {
                ...analysis,
                hash: this.generateCodeHash(componentCode)
            } as ComponentAnalysisWithMemory);

            console.log(`✅ Enhanced тесты сгенерированы для: ${componentPath} (${duration}ms)`);

            return fullResult;

        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`❌ Ошибка enhanced генерации тестов для ${componentPath}:`, error);

            await this.recordFailedExecution(
                componentCode,
                componentPath,
                error,
                duration
            );

            throw error;
        }
    }

    /**
     * Генерирует улучшенные тесты с учетом памяти
     */
    private async generateEnhancedTests(
        componentCode: string,
        analysis: ComponentAnalysis,
        plan: TestPlan,
        memoryContext: string,
        options?: { testTypes?: TestType[]; exclude?: TestType[] }
    ): Promise<TestGenerationResult> {
        const result = await this.testGenerator.execute({
            componentCode,
            componentPath: this.currentComponentPath,
            analysis,
            framework: `${this.config.testFramework} + ${this.config.testingLibrary}`,
            testTypes: options?.testTypes,
            exclude: options?.exclude,
            options: {
                memoryContext
            }
        });

        return result;
    }

    /**
     * Получает расширенный анализ компонента (включая hash и историю)
     */
    getEnhancedComponentAnalysis(componentPath: string): ComponentAnalysisWithMemory | undefined {
        return this.memory.componentAnalysis.get(componentPath);
    }

    /**
     * Получает компоненты по hash
     */
    getComponentsByHash(hash: string): ComponentAnalysisWithMemory[] {
        const components: ComponentAnalysisWithMemory[] = [];
        this.memory.componentAnalysis.forEach((analysis: any) => {
            if (analysis.hash === hash) {
                components.push(analysis);
            }
        });
        return components;
    }

    /**
     * Записывает успешное выполнение в память
     */
    private async recordSuccessfulExecution(
        componentCode: string,
        componentPath: string,
        result: TestGenerationResult,
        duration: number
    ): Promise<void> {
        const execution: Omit<TestExecution, 'id'> = {
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
        };

        this.recordTestExecution(execution);
        await this.memoryManager.recordTestExecution(execution);
    }

    /**
     * Записывает неудачное выполнение в память
     */
    private async recordFailedExecution(
        componentCode: string,
        componentPath: string,
        error: unknown,
        duration: number
    ): Promise<void> {
        const execution: Omit<TestExecution, 'id'> = {
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
                error: error instanceof Error ? error.message : 'Unknown error',
                duration,
                testsPassed: 0,
                testsFailed: 0
            }
        };

        this.recordTestExecution(execution);
        await this.memoryManager.recordTestExecution(execution);
    }

    /**
     * Генерирует улучшенный план тестирования с учетом памяти
     */
    private async generateEnhancedPlan(
        componentCode: string,
        analysis: ComponentAnalysis,
        memoryContext: string
    ): Promise<TestPlan> {
        try {
            if (!analysis) {
                throw new Error('Analysis is undefined');
            }

            const plan = await this.planner.plan(componentCode, analysis);

            if (plan && memoryContext) {
                plan.riskAreas = plan.riskAreas || [];
                plan.riskAreas.push('Учтен контекст из памяти');
            }

            return plan;
        } catch (error) {
            console.error('❌ Ошибка в generateEnhancedPlan:', error);
            return {
                componentType: analysis?.componentType || 'unknown',
                testPriority: 'medium',
                requiredTests: ['Базовые тесты компонента'],
                dependencies: analysis?.dependencies || [],
                estimatedTime: '5-10 minutes',
                riskAreas: ['Требуется ручная проверка']
            };
        }
    }

    /**
     * Строит контекст из памяти
     */
    private buildContextFromMemory(
        similarComponents: any[],
        bestPractices: any[],
        commonErrors: any[]
    ): string {
        let context = 'Контекст из предыдущего опыта:\n\n';

        if (similarComponents.length > 0) {
            context += 'Похожие компоненты из истории:\n';
            similarComponents.slice(0, 3).forEach((similar, index) => {
                context += `${index + 1}. ${similar.testExecution.componentPath} (схожесть: ${(similar.similarity * 100).toFixed(1)}%)\n`;
            });
            context += '\n';
        }

        if (bestPractices.length > 0) {
            context += 'Рекомендуемые паттерны тестирования:\n';
            bestPractices.forEach((practice, index) => {
                context += `${index + 1}. ${practice.name}: ${practice.description}\n`;
            });
            context += '\n';
        }

        if (commonErrors.length > 0) {
            context += 'Частые ошибки для этого типа компонентов:\n';
            commonErrors.slice(0, 3).forEach((error, index) => {
                context += `${index + 1}. ${error.description}\n   Решение: ${error.solution}\n`;
            });
        }

        return context;
    }

    /**
     * Генерирует рекомендации на основе анализа
     */
    private generateRecommendations() {
        const recommendations: string[] = [];
        const metrics = this.memoryManager.getPerformanceMetrics();

        if (metrics.successRate < 0.8) {
            recommendations.push('❌ Низкий процент успешных тестов. Рекомендуется проанализировать частые ошибки.');
        }

        if (metrics.averageGenerationTime > 10000) {
            recommendations.push('⚠️ Высокое время генерации тестов. Рассмотрите оптимизацию сложных компонентов.');
        }

        const components = this.memoryManager.getAllComponents();
        const highComplexityCount = Array.from(components.values())
            .filter(comp => comp.complexity === 'high').length;

        if (highComplexityCount > 5) {
            recommendations.push('🔍 Много компонентов высокой сложности. Рекомендуется рефакторинг.');
        }

        return recommendations.length > 0 ? recommendations : ['✅ Все показатели в норме!'];
    }

    /**
     * Анализирует тренды производительности
     */
    private analyzeTrends() {
        const history = this.memoryManager.getTestHistory();
        if (history.length < 2) return { trend: 'stable', description: 'Недостаточно данных для анализа трендов' };

        const recentSuccessRate = this.calculateRecentSuccessRate(history);
        const averageDuration = history.reduce((sum, exec) => sum + exec.result.duration, 0) / history.length;

        return {
            trend: recentSuccessRate > 0.8 ? 'improving' : 'needs_attention',
            recentSuccessRate,
            averageDuration: Math.round(averageDuration),
            totalExecutions: history.length
        };
    }

    /**
     * Рассчитывает успешность последних выполнений
     */
    private calculateRecentSuccessRate(history: TestExecution[]): number {
        const recent = history.slice(-10);
        if (recent.length === 0) return 0;

        const successful = recent.filter(exec => exec.result.success).length;
        return successful / recent.length;
    }

    /**
     * Получает возраст кэша в миллисекундах
     */
    private getCacheAge(timestamp: Date): number {
        return Date.now() - timestamp.getTime();
    }
}