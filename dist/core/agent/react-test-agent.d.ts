import { LLMProvider } from '../llm/llm-provider';
import { TestGeneratorTool } from '../../tools';
import { AgentConfig, AgentMemory, ComponentAnalysis, TestGenerationResult, Planner, TestExecution, LLMProviderType } from '../../types/agent';
export declare class ReactTestAgent {
    protected config: AgentConfig;
    planner: Planner;
    testGenerator: TestGeneratorTool;
    protected llm: LLMProvider;
    private executor;
    protected memory: AgentMemory;
    private componentAnalyzer;
    private providerType;
    constructor(config: AgentConfig);
    /**
     * Создает LLM провайдер на основе конфигурации
     */
    private createLLMProvider;
    /**
     * Проверяет инициализацию провайдера
     */
    initialize(): Promise<void>;
    /**
     * Возвращает тип провайдера
     */
    getProviderType(): LLMProviderType;
    /**
     * Проверяет, инициализирован ли агент
     */
    isInitialized(): boolean;
    /**
     * Переключает провайдера во время работы
     */
    switchProvider(providerType: LLMProviderType): void;
    /**
     * Анализирует React компонент и возвращает его структуру
     */
    analyzeComponent(componentCode: string): Promise<ComponentAnalysis>;
    /**
     * Генерирует полный набор тестов для компонента
     */
    generateCompleteTests(componentCode: string, componentPath: string): Promise<TestGenerationResult>;
    /**
     * Генерирует hash для кода компонента
     */
    generateCodeHash(code: string): string;
    /**
     * Генерирует тесты для нескольких компонентов
     */
    generateTestsForProject(components: Array<{
        code: string;
        path: string;
    }>): Promise<Array<TestGenerationResult & {
        status: string;
    }>>;
    /**
     * Возвращает путь для файла тестов
     */
    getTestFilePath(componentPath: string): string;
    /**
     * Возвращает текущую память агента
     */
    getMemory(): AgentMemory;
    /**
     * Очищает память агента
     */
    clearMemory(): void;
    /**
     * Генерирует отчет о работе агента
     */
    generateReport(): {
        summary: {
            totalComponents: number;
            successfulTests: number;
            successRate: string;
            componentsAnalyzed: number;
            provider: LLMProviderType;
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
     * Генерирует детализированный отчет
     */
    getDetailedReport(): {
        providerInfo: {
            type: LLMProviderType;
            config: {
                temperature: number;
                maxTokens: number | undefined;
                framework: "jest" | "vitest";
                library: "react-testing-library" | "enzyme";
            };
        };
        testHistory: {
            component: string;
            timestamp: string;
            testCases: string[];
            success: boolean;
            errors: string[];
            duration: number;
        }[];
        componentAnalysis: {
            path: string;
            complexity: "low" | "medium" | "high";
            props: number;
            states: number;
            type: string;
            dependencies: string[];
        }[];
        summary: {
            totalComponents: number;
            successfulTests: number;
            successRate: string;
            componentsAnalyzed: number;
            provider: LLMProviderType;
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
     * Экспортирует отчет в различных форматах
     */
    exportReport(format?: 'json' | 'text'): string | object;
    /**
     * Возвращает историю тестирования для конкретного компонента
     */
    getComponentTestHistory(componentPath: string): TestExecution[];
    /**
     * Возвращает анализ конкретного компонента
     */
    getComponentAnalysis(componentPath: string): ComponentAnalysis | undefined;
    /**
     * Анализирует компоненты по сложности
     */
    private analyzeComponentsByComplexity;
    /**
     * Проверяет, был ли уже проанализирован компонент
     */
    hasComponentBeenAnalyzed(componentPath: string): boolean;
    /**
     * Возвращает текущую конфигурацию агента
     */
    getConfig(): AgentConfig;
    /**
     * Возвращает количество успешных тестов
     */
    getSuccessRate(): number;
    /**
     * Возвращает статистику по сложности компонентов
     */
    getComplexityStats(): {
        low: number;
        medium: number;
        high: number;
    };
    /**
     * Записывает выполнение теста в память
     */
    protected recordTestExecution(execution: Omit<TestExecution, 'id'>): void;
    /**
     * Генерирует ID для выполнения теста
     */
    private generateExecutionId;
    /**
     * Возвращает последнюю активность
     */
    private getRecentActivity;
    /**
     * Оценивает покрытие тестов на основе эвристики
     */
    protected estimateCoverage(testCode: string): number;
    /**
     * Валидирует код компонента перед анализом
     */
    private validateComponentCode;
}
