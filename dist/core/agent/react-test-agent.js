import { DeepSeekProvider } from '../llm/deepseek-provider';
import { GigaChatProvider } from '../llm/gigachat-provider';
import { ComponentAnalyzerTool, TestGeneratorTool } from '../../tools';
import { TestPlanner } from '../../planners/test-planner';
import { TestExecutor } from '../../executors/test-executor';
import { env } from "../../env";
export class ReactTestAgent {
    constructor(config) {
        this.config = config;
        this.providerType = config.providerType || 'deepseek';
        this.llm = this.createLLMProvider(config);
        this.planner = new TestPlanner(this.llm);
        this.executor = new TestExecutor();
        this.componentAnalyzer = new ComponentAnalyzerTool(this.llm);
        this.testGenerator = new TestGeneratorTool(this.llm);
        // Инициализируем componentAnalysis как Map
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
    // src/core/agent/react-test-agent.ts (добавьте в метод createLLMProvider)
    createLLMProvider(config) {
        const providerType = config.providerType || 'deepseek';
        switch (providerType) {
            case 'gigachat':
                // Используем env переменные
                const clientId = config.clientId || env.GIGACHAT_CLIENT_ID;
                const clientSecret = config.clientSecret || env.GIGACHAT_CLIENT_SECRET;
                if (!clientId || !clientSecret) {
                    throw new Error('GigaChat requires clientId and clientSecret');
                }
                return new GigaChatProvider(clientId, clientSecret, {
                    temperature: config.temperature || 0.3,
                    maxTokens: config.maxTokens || 4000
                });
            case 'deepseek':
            default:
                if (!config.apiKey && !env.DEEPSEEK_API_KEY) {
                    throw new Error('DeepSeek requires apiKey');
                }
                return new DeepSeekProvider(config.apiKey || env.DEEPSEEK_API_KEY, {
                    temperature: config.temperature || 0.3,
                    maxTokens: config.maxTokens || 4000
                });
        }
    }
    /**
     * Проверяет инициализацию провайдера
     */
    async initialize() {
        try {
            // Для GigaChat проверяем соединение
            if (this.providerType === 'gigachat' && this.llm instanceof GigaChatProvider) {
                const isConnected = await this.llm.testConnection();
                if (!isConnected) {
                    throw new Error('GigaChat connection failed');
                }
                console.log('✅ GigaChat provider initialized successfully');
            }
            else {
                console.log(`✅ ${this.providerType} provider initialized successfully`);
            }
        }
        catch (error) {
            console.error('❌ Provider initialization failed:', error);
            throw error;
        }
    }
    /**
     * Возвращает тип провайдера
     */
    getProviderType() {
        return this.providerType;
    }
    /**
     * Проверяет, инициализирован ли агент
     */
    isInitialized() {
        return this.llm !== null && this.llm !== undefined;
    }
    /**
     * Переключает провайдера во время работы
     */
    switchProvider(providerType) {
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
    async analyzeComponent(componentCode) {
        console.log('🔍 Анализирую компонент...');
        try {
            this.validateComponentCode(componentCode);
            const analysis = await this.componentAnalyzer.execute({
                code: componentCode,
                componentPath: 'unknown'
            });
            console.log(`✅ Компонент проанализирован. Сложность: ${analysis.complexity}`);
            return analysis;
        }
        catch (error) {
            console.error('❌ Ошибка анализа компонента:', error);
            throw new Error(`Failed to analyze component: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Генерирует полный набор тестов для компонента
     */
    async generateCompleteTests(componentCode, componentPath) {
        console.log(`🚀 Запускаю генерацию тестов для: ${componentPath} (${this.providerType})`);
        const startTime = Date.now();
        try {
            // 1. Анализ компонента
            const analysis = await this.analyzeComponent(componentCode);
            // 2. Планирование тестирования
            const plan = await this.planner.plan(componentCode, analysis);
            // 3. Генерация тестов
            const { testCases, testCode } = await this.testGenerator.execute({
                componentCode,
                analysis,
                framework: `${this.config.testFramework} + ${this.config.testingLibrary}`
            });
            const duration = Date.now() - startTime;
            // 4. Сохранение в память
            this.recordTestExecution({
                componentPath,
                timestamp: new Date(),
                input: {
                    code: componentCode,
                    config: this.config
                },
                output: {
                    testCode,
                    testCases,
                    plan
                },
                result: {
                    success: true,
                    duration,
                    coverage: this.estimateCoverage(testCode),
                    testsPassed: testCases.length,
                    testsFailed: 0
                }
            });
            // Сохраняем анализ в память
            this.memory.componentAnalysis.set(componentPath, {
                ...analysis,
                hash: this.generateCodeHash(componentCode)
            });
            console.log(`✅ Тесты сгенерированы для: ${componentPath} (${duration}ms)`);
            return {
                plan,
                analysis,
                testCases,
                testCode,
                filePath: this.getTestFilePath(componentPath)
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            console.error(`❌ Ошибка генерации тестов для ${componentPath}:`, error);
            // Записываем неудачное выполнение
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
                    plan: {}
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
    generateCodeHash(code) {
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
    async generateTestsForProject(components) {
        console.log(`📦 Начинаю пакетную генерацию тестов для ${components.length} компонентов (${this.providerType})`);
        const results = [];
        for (const component of components) {
            try {
                const result = await this.generateCompleteTests(component.code, component.path);
                results.push({ ...result, status: 'success' });
                console.log(`✅ Успешно: ${component.path}`);
            }
            catch (error) {
                results.push({
                    component: component.path,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    status: 'failed',
                    plan: {},
                    analysis: {},
                    testCases: [],
                    testCode: '',
                    filePath: ''
                });
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
    getTestFilePath(componentPath) {
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
    getMemory() {
        return this.memory;
    }
    /**
     * Очищает память агента
     */
    clearMemory() {
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
        const successful = this.memory.testHistory.filter(entry => !entry.result || entry.result.success).length;
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
    exportReport(format = 'text') {
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
${report.recentActivity.map(activity => `• ${activity.component} - ${activity.success ? '✅' : '❌'} (${activity.duration}ms)`).join('\n')}

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
    getComponentTestHistory(componentPath) {
        return this.memory.testHistory.filter(entry => entry.componentPath === componentPath);
    }
    /**
     * Возвращает анализ конкретного компонента
     */
    getComponentAnalysis(componentPath) {
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
    analyzeComponentsByComplexity() {
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
    hasComponentBeenAnalyzed(componentPath) {
        return this.memory.componentAnalysis.has(componentPath);
    }
    /**
     * Возвращает текущую конфигурацию агента
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Возвращает количество успешных тестов
     */
    getSuccessRate() {
        const total = this.memory.testHistory.length;
        if (total === 0)
            return 0;
        const successful = this.memory.testHistory.filter(entry => !entry.result || entry.result.success).length;
        return successful / total;
    }
    /**
     * Возвращает статистику по сложности компонентов
     */
    getComplexityStats() {
        return this.analyzeComponentsByComplexity();
    }
    // Приватные вспомогательные методы
    /**
     * Записывает выполнение теста в память
     */
    recordTestExecution(execution) {
        const executionWithId = {
            ...execution,
            id: this.generateExecutionId()
        };
        this.memory.testHistory.push(executionWithId);
    }
    /**
     * Генерирует ID для выполнения теста
     */
    generateExecutionId() {
        return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Возвращает последнюю активность
     */
    getRecentActivity() {
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
    estimateCoverage(testCode) {
        const testCount = (testCode.match(/test\(/g) || []).length;
        const itCount = (testCode.match(/it\(/g) || []).length;
        const describeCount = (testCode.match(/describe\(/g) || []).length;
        const totalTests = testCount + itCount;
        if (totalTests === 0)
            return 0;
        const baseCoverage = Math.min(100, totalTests * 15 + describeCount * 5);
        let bonus = 0;
        if (testCode.includes('fireEvent') || testCode.includes('userEvent'))
            bonus += 10;
        if (testCode.includes('async') || testCode.includes('await'))
            bonus += 10;
        if (testCode.includes('mock') || testCode.includes('jest.mock'))
            bonus += 5;
        return Math.min(100, baseCoverage + bonus);
    }
    /**
     * Валидирует код компонента перед анализом
     */
    validateComponentCode(code) {
        if (!code || code.trim().length === 0) {
            throw new Error('Component code is empty');
        }
        if (!code.includes('React') && !code.includes('react')) {
            console.warn('⚠️  Component code may not be a React component');
        }
        return true;
    }
}
//# sourceMappingURL=react-test-agent.js.map