export interface ComponentAnalysis {
    props: PropDefinition[];
    states: StateDefinition[];
    effects: EffectDefinition[];
    events: EventHandlerDefinition[];
    dependencies: string[];
    complexity: 'low' | 'medium' | 'high';
    componentType: string;
    subComponents?: string[];
    externalServices?: string[];
    contextUsages?: string[];
    reduxSlices?: string[];
    networkCalls?: { url: string; method: string }[];
    localImports?: string[];
}

// Расширяем ComponentAnalysis для использования в памяти
export interface ComponentAnalysisWithMemory extends ComponentAnalysis {
    hash?: string;
    testHistory?: string[];
}

export interface PropDefinition {
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
}

export interface StateDefinition {
    name: string;
    type: string;
    initialValue: string;
}

export interface EffectDefinition {
    dependencies: string[];
    purpose: string;
}

export interface EventHandlerDefinition {
    name: string;
    parameters: string[];
}

export interface TestPlan {
    componentType: string;
    testPriority: 'high' | 'medium' | 'low';
    requiredTests: string[];
    dependencies: string[];
    estimatedTime: string;
    riskAreas: string[];
}

export type LLMProviderType = 'gigachat';

export interface AgentConfig {
    // GigaChat
    clientId?: string;
    clientSecret?: string;
    scope?: string;

    // Общие
    providerType?: LLMProviderType;
    testFramework: 'jest' | 'vitest';
    testingLibrary: 'react-testing-library' | 'enzyme';
    temperature: number;
    maxTokens?: number;
    coverage?: boolean;
    generateMocks?: boolean;
    maxRetries?: number;
}
export interface TestExecution {
    id: string;
    componentPath: string;
    timestamp: Date; // Изменяем с string на Date
    input: {
        code: string;
        config: AgentConfig;
    };
    output: {
        testCode: string;
        testCases: string[];
        plan: TestPlan;
    };
    result: TestResult;
    feedback?: UserFeedback;
}


export interface UserFeedback {
    userRating?: number;
    userComments?: string;
    autoFeedback?: AutoFeedback;
}

export interface AutoFeedback {
    codeQuality: number;
    testCoverage: number;
    bestPractices: number;
}

export interface TestPattern {
    id: string;
    name: string;
    description: string;
    codeExample: string;
    usageCount: number;
    successRate: number;
    applicableTo: string[];
    tags: string[];
}

export interface ErrorPattern {
    id: string;
    type: 'syntax' | 'logic' | 'performance' | 'coverage' | 'dependency' | 'unknown';
    description: string;
    solution: string;
    occurrenceCount: number;
    lastOccurred: Date;
    components: string[];
}

export interface PerformanceMetrics {
    averageGenerationTime: number;
    successRate: number;
    coverageTrend: number[];
    componentComplexityCorrelation: {
        [complexity: string]: {
            successRate: number;
            averageTime: number;
        };
    };
    toolUsage: {
        [toolName: string]: {
            count: number;
            successRate: number;
            averageTime: number;
        };
    };
}

export interface ProjectContext {
    techStack: string[];
    testingPreferences: Record<string, any>;
    commonPatterns: string[];
}

export interface MemoryCache {
    componentAnalysis: Map<string, { analysis: ComponentAnalysis; timestamp: Date }>;
    testPatterns: Map<string, TestPattern[]>;
    errorPatterns: Map<string, ErrorPattern[]>;
}
export interface AgentMemory {
    testHistory: TestExecution[];
    componentAnalysis: Map<string, ComponentAnalysisWithMemory>; // Используем расширенный тип
    commonPatterns: TestPattern[];
    errorPatterns: ErrorPattern[];

    // Дополнительные поля для Enhanced агента
    patterns?: {
        testPatterns: TestPattern[];
        errorPatterns: ErrorPattern[];
        bestPractices: TestPattern[];
        antiPatterns: ErrorPattern[];
    };
    performance?: PerformanceMetrics;
    projectContext?: ProjectContext;
    cache?: MemoryCache;
}
// Базовые интерфейсы архитектуры
export interface LLMProvider {
    generate(prompt: string, context?: string): Promise<string>;
    generateStructured<T>(prompt: string, schema: any): Promise<T>;
    analyze(code: string, context: string): Promise<any>;
}

export interface Tool {
    name: string;
    description: string;
    execute(input: any): Promise<any>;
}

export interface Planner {
    plan(componentCode: string, analysis: ComponentAnalysis): Promise<TestPlan>;
}

export interface Executor {
    execute(plan: TestPlan, context: AgentContext): Promise<ExecutionResult>;
}

export interface AgentContext {
    config: AgentConfig;
    memory: AgentMemory;
    componentPath: string;
}

export interface ExecutionResult {
    success: boolean;
    output?: any;
    error?: string;
    duration: number;
}

// Вспомогательные типы
export interface JestTestResults {
    numPassedTests: number;
    numFailedTests: number;
    numPendingTests: number;
    testResults: Array<{
        name: string;
        status: 'passed' | 'failed' | 'pending';
        duration: number;
    }>;
}

export interface ComponentComplexity {
    score: number;
    level: 'low' | 'medium' | 'high';
    factors: string[];
}



// Исправьте TestResult чтобы error был опциональным:
export interface TestResult {
    success: boolean;
    testsPassed: number;
    testsFailed: number;
    error?: string; // Опциональный
    duration: number;
    coverage?: number;
}

