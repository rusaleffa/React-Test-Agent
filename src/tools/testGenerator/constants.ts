// src/tools/testGenerator/constants.ts
import { TestType, GeneratorConfig } from './types';

// ============================================
// РАСШИРЕНИЯ ФАЙЛОВ
// ============================================
export const DEFAULT_EXTENSIONS: Record<TestType, string> = {
    [TestType.UNIT]: 'unit.test.tsx',
    [TestType.INTEGRATION]: 'integration.test.tsx',
    [TestType.E2E]: 'e2e.test.ts',
    [TestType.SNAPSHOT]: 'snapshot.test.tsx',
    [TestType.VISUAL]: 'visual.test.tsx',
    [TestType.PERFORMANCE]: 'performance.test.ts'
};

// ============================================
// ЗАВИСИМОСТИ ПО УМОЛЧАНИЮ
// ============================================
export const DEFAULT_DEPENDENCIES: Record<TestType, string[]> = {
    [TestType.UNIT]: [
        '@testing-library/react',
        '@testing-library/jest-dom',
        '@testing-library/user-event'
    ],
    [TestType.INTEGRATION]: [
        '@testing-library/react',
        '@testing-library/jest-dom',
        'msw'
    ],
    [TestType.E2E]: [
        '@playwright/test'
    ],
    [TestType.SNAPSHOT]: [
        '@testing-library/react',
        'react-test-renderer'
    ],
    [TestType.VISUAL]: [
        '@testing-library/react',
        'jest-image-snapshot'
    ],
    [TestType.PERFORMANCE]: [
        '@testing-library/react',
        'perf_hooks'
    ]
};

// ============================================
// КОНФИГ ПО УМОЛЧАНИЮ
// ============================================
export const DEFAULT_CONFIG: GeneratorConfig = {
    outputDir: '__tests__',
    extensions: DEFAULT_EXTENSIONS,
    dependencies: DEFAULT_DEPENDENCIES,
    maxRetries: 3,
    timeout: 30000,
    enableCache: true,
    cacheTTL: 3600000
};

// ============================================
// ПАТТЕРНЫ ДЛЯ ИЗВЛЕЧЕНИЯ ИМЕНИ КОМПОНЕНТА
// ============================================
export const COMPONENT_NAME_PATTERNS = [
    /export\s+default\s+(?:function|class|const)\s+(\w+)/,
    /export\s+(?:function|class|const)\s+(\w+)/,
    /function\s+(\w+)\s*\(/,
    /const\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function)/
];

// ============================================
// ПОРОГИ ДЛЯ АВТООПРЕДЕЛЕНИЯ ТИПОВ
// ============================================
export const DETECTION_THRESHOLDS = {
    integration: {
        minDependencies: 1,
        minEffects: 1
    },
    e2e: {
        minEvents: 2
    },
    performance: {
        maxProps: 5,
        maxStates: 3,
        maxEffects: 3
    }
};