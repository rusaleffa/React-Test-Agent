import { AgentMemory, TestExecution, ComponentAnalysis, TestPattern, ErrorPattern, PerformanceMetrics, ProjectContext, ComponentAnalysisWithMemory } from '../../types/agent';
import { MemoryStorage } from './storage';
export declare class MemoryManager {
    private memory;
    private storage;
    private initialized;
    constructor(storage?: MemoryStorage);
    /**
     * Инициализирует менеджер памяти
     */
    initialize(): Promise<void>;
    /**
     * Проверяет, инициализирован ли менеджер памяти
     */
    isInitialized(): boolean;
    /**
     * Записывает выполнение теста в память
     */
    recordTestExecution(execution: Omit<TestExecution, 'id'>): Promise<string>;
    /**
     * Ищет похожие компоненты
     */
    findSimilarComponents(currentComponentCode: string): Promise<{
        component: ComponentAnalysisWithMemory;
        similarity: number;
        testExecution: TestExecution;
    }[]>;
    /**
     * Получает лучшие практики для типа компонента
     */
    getBestPractices(componentType: string): TestPattern[];
    /**
     * Получает частые ошибки для сложности компонента
     */
    getCommonErrors(componentComplexity: string): ErrorPattern[];
    /**
     * Получает метрики производительности
     */
    getPerformanceMetrics(): PerformanceMetrics;
    /**
     * Получает контекст проекта
     */
    getProjectContext(): ProjectContext;
    /**
     * Обновляет контекст проекта
     */
    updateProjectContext(updates: Partial<ProjectContext>): void;
    /**
     * Получает историю тестов
     */
    getTestHistory(): TestExecution[];
    /**
     * Получает анализ компонента
     */
    getComponentAnalysis(componentPath: string): ComponentAnalysis | undefined;
    /**
     * Получает все компоненты
     */
    getAllComponents(): Map<string, ComponentAnalysis>;
    /**
     * Получает кэшированный анализ
     */
    getCachedAnalysis(componentPath: string): {
        analysis: ComponentAnalysis;
        timestamp: Date;
    } | undefined;
    /**
     * Проверяет валидность кэша
     */
    isCacheValid(componentPath: string, maxAgeMinutes?: number): boolean;
    /**
     * Получает размер кэша
     */
    getCacheSize(): number;
    /**
     * Получает количество паттернов
     */
    getPatternsCount(): {
        testPatterns: number;
        errorPatterns: number;
    };
    /**
     * Очищает память
     */
    clear(): Promise<void>;
    /**
     * Добавляет паттерн тестирования
     */
    addTestPattern(pattern: Omit<TestPattern, 'id'>): void;
    /**
     * Добавляет паттерн ошибки
     */
    addErrorPattern(error: Omit<ErrorPattern, 'id'>): void;
    private ensureInitialized;
    private ensureInitializedSync;
    private updateComponentAnalysis;
    private analyzeComponentForMemory;
    private updateCache;
    private updatePatterns;
    private updatePerformanceMetrics;
    private calculateComplexityCorrelation;
    private calculateToolUsage;
    private generateCodeHash;
    private calculateComponentSimilarity;
    private analyzeComponentStructure;
    private extractProps;
    private extractStates;
    private extractEffects;
    private extractEvents;
    private extractDependencies;
    private determineComponentType;
    private calculateComplexity;
    private isErrorRelevantForComplexity;
    private extractPatternsFromTests;
    private analyzeErrors;
    private classifyError;
    private suggestSolution;
    private recordSuccessfulPattern;
    private recordErrorPattern;
    private extractRelevantCodeExample;
    private generateId;
    private generatePatternId;
    private generateErrorId;
    loadMemory(): Promise<AgentMemory>;
    private saveMemory;
    private getDefaultMemory;
    private ensureMemoryStructure;
}
