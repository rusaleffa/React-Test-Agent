// src/tools/testGenerator/types.ts
import { ComponentAnalysis, TestPlan } from '../../types/agent';

// ============================================
// ТИПЫ ТЕСТОВ (ENUM)
// ============================================
export enum TestType {
    UNIT = 'unit',
    INTEGRATION = 'integration',
    E2E = 'e2e',
    SNAPSHOT = 'snapshot',
    VISUAL = 'visual',
    PERFORMANCE = 'performance'
}

// ============================================
// ВХОДНЫЕ ДАННЫЕ
// ============================================
export interface TestGenerationInput {
    componentCode: string;
    componentName: string;
    componentPath: string;
    analysis: ComponentAnalysis;
    options?: Record<string, any>;
}

// ============================================
// ВЫХОДНЫЕ ДАННЫЕ ГЕНЕРАТОРА
// ============================================
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

// ============================================
// РЕЗУЛЬТАТ ГЕНЕРАЦИИ (ОРКЕСТРАТОР)
// ============================================
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

// ============================================
// ИНТЕРФЕЙС ГЕНЕРАТОРА
// ============================================
export interface ITestGenerator {
    readonly name: string;
    readonly type: TestType;
    readonly description: string;
    generate(input: TestGenerationInput): Promise<TestGenerationOutput>;
    isApplicable(analysis: ComponentAnalysis): boolean;
}

// ============================================
// КОНФИГУРАЦИЯ
// ============================================
export interface GeneratorConfig {
    outputDir?: string;
    extensions?: Record<TestType, string>;
    dependencies?: Record<TestType, string[]>;
    maxRetries?: number;
    timeout?: number;
    enableCache?: boolean;
    cacheTTL?: number;
}

// ============================================
// ОШИБКИ ГЕНЕРАЦИИ
// ============================================
export class GenerationError extends Error {
    constructor(
        message: string,
        public type: TestType,
        public cause?: Error
    ) {
        super(message);
        this.name = 'GenerationError';
    }
}