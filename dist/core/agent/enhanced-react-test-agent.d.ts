import { ReactTestAgent } from './react-test-agent';
import { AgentConfig, TestGenerationResult, TestExecution, ComponentAnalysis, ComponentAnalysisWithMemory } from '../../types/agent';
export declare class EnhancedReactTestAgent extends ReactTestAgent {
    private memoryManager;
    private memoryInitialized;
    constructor(config: AgentConfig);
    /**
     * Инициализирует enhanced поля памяти
     */
    private initializeEnhancedMemory;
    /**
     * Инициализирует память агента
     */
    initialize(): Promise<void>;
    /**
     * Синхронизирует память агента с менеджером памяти
     */
    private syncMemoryWithManager;
    /**
     * Генерирует расширенный отчет
     */
    generateEnhancedReport(): {
        memory: {
            testExecutions: number;
            cachedComponents: number;
            performance: import("../../types/agent").PerformanceMetrics;
            projectTechStack: string[];
        };
        recommendations: string[];
        trends: {
            trend: string;
            description: string;
            recentSuccessRate?: undefined;
            averageDuration?: undefined;
            totalExecutions?: undefined;
        } | {
            trend: string;
            recentSuccessRate: number;
            averageDuration: number;
            totalExecutions: number;
            description?: undefined;
        };
        memoryStats: {
            initialized: boolean;
            cacheSize: number;
            patternsCount: number;
        };
        summary: {
            totalComponents: number;
            successfulTests: number;
            successRate: string;
            componentsAnalyzed: number;
            provider: import("../../types/agent").LLMProviderType;
        };
        complexityBreakdown: {
            low: number;
            medium: number;
            high: number;
        };
        recentActivity: {
            component: string;
            timestamp: string;
            success: boolean;
            duration: number;
        }[];
        components: string[];
        patternsDiscovered: number;
        commonErrors: number;
    };
    /**
     * Проверяет, инициализирован ли агент
     */
    isInitialized(): boolean;
    /**
     * Получает отчет о производительности
     */
    getPerformanceReport(): Promise<import("../../types/agent").PerformanceMetrics>;
    /**
     * Получает контекст проекта
     */
    getProjectContext(): Promise<import("../../types/agent").ProjectContext>;
    /**
     * Обновляет контекст проекта
     */
    updateProjectContext(updates: any): Promise<void>;
    /**
     * Получает историю тестов
     */
    getTestHistory(): Promise<TestExecution[]>;
    /**
     * Очищает память агента
     */
    clearMemory(): Promise<void>;
    /**
     * Получает все проанализированные компоненты
     */
    getAllComponents(): Promise<Map<string, ComponentAnalysis>>;
    /**
     * Генерирует полный набор тестов для компонента с использованием памяти
     */
    generateCompleteTests(componentCode: string, componentPath: string): Promise<TestGenerationResult>;
    /**
     * Получает расширенный анализ компонента (включая hash и историю)
     */
    getEnhancedComponentAnalysis(componentPath: string): ComponentAnalysisWithMemory | undefined;
    /**
     * Получает компоненты по hash
     */
    getComponentsByHash(hash: string): ComponentAnalysisWithMemory[];
    /**
     * Записывает успешное выполнение в память
     */
    private recordSuccessfulExecution;
    /**
     * Записывает неудачное выполнение в память
     */
    private recordFailedExecution;
    /**
     * Генерирует улучшенный план тестирования с учетом памяти
     */
    private generateEnhancedPlan;
    /**
     * Генерирует улучшенные тесты с учетом памяти
     */
    private generateEnhancedTests;
    /**
     * Строит контекст из памяти
     */
    private buildContextFromMemory;
    /**
     * Генерирует рекомендации на основе анализа
     */
    private generateRecommendations;
    /**
     * Анализирует тренды производительности
     */
    private analyzeTrends;
    /**
     * Рассчитывает успешность последних выполнений
     */
    private calculateRecentSuccessRate;
    /**
     * Получает возраст кэша в миллисекундах
     */
    private getCacheAge;
}
