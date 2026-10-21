import { ComponentAnalysis, TestPlan } from '../../types/agent';

// Типы генерируемых тестов
export enum TestType {
    UNIT = 'unit',
    INTEGRATION = 'integration',
    E2E = 'e2e',
    SNAPSHOT = 'snapshot',
    VISUAL = 'visual',
    PERFORMANCE = 'performance'
}

// Входные данные для генератора тестов
export interface TestGenerationInput {
    componentCode: string;
    componentName: string;
    componentPath: string;
    analysis: ComponentAnalysis;
    options?: Record<string, any>;
}

// Результат работы одного генератора
export interface TestGenerationOutput {
    testCode: string;
    testFileName: string;
    testDir: string;
    testType: TestType;
    description: string;
    dependencies?: string[];
    mocks?: string[];
    setupFiles?: string[];
    metadata?: {
        generatedAt: Date;
        componentName: string;
        testCount?: number;
        coverage?: number;
    };
}

// Итоговый результат работы оркестратора
export interface TestGenerationResult {
    plan: TestPlan;
    analysis: ComponentAnalysis;
    filePath: string;
    testCases: string[];
    testCode: string;
    generatedFiles: GeneratedFile[];
    summary: TestSummary;
}

export interface GeneratedFile {
    type: TestType;
    path: string;
    content: string;
    size: number;
}

export interface TestSummary {
    totalFiles: number;
    totalTestCases: number;
    typesGenerated: TestType[];
    executionTime: number;
    errors?: Array<{ type: TestType; error: string }>;
}

// Контракт, которому следует каждый генератор
export interface ITestGenerator {
    readonly name: string;
    readonly type: TestType;
    readonly description: string;
    generate(input: TestGenerationInput): Promise<TestGenerationOutput>;
    isApplicable(analysis: ComponentAnalysis): boolean;
}

// Конфигурация инструмента генерации
export interface GeneratorConfig {
    outputDir?: string;
    extensions?: Record<TestType, string>;
    dependencies?: Record<TestType, string[]>;
    maxRetries?: number;
    timeout?: number;
    enableCache?: boolean;
    cacheTTL?: number;
}