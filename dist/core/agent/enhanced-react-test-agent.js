import { ReactTestAgent } from './react-test-agent';
import { MemoryManager } from '../memory/memory-manager';
export class EnhancedReactTestAgent extends ReactTestAgent {
    constructor(config) {
        super(config);
        this.memoryInitialized = false;
        this.memoryManager = new MemoryManager();
        // Инициализируем enhanced поля памяти
        this.initializeEnhancedMemory();
    }
    /**
     * Инициализирует enhanced поля памяти
     */
    initializeEnhancedMemory() {
        // componentAnalysis уже инициализирован в родительском классе как Map
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
    async initialize() {
        if (this.memoryInitialized) {
            return;
        }
        try {
            console.log('🔄 Initializing EnhancedReactTestAgent...');
            await this.memoryManager.initialize();
            // Синхронизируем память менеджера с памятью агента
            await this.syncMemoryWithManager();
            this.memoryInitialized = true;
            console.log('✅ EnhancedReactTestAgent initialized with memory management');
        }
        catch (error) {
            console.error('❌ Failed to initialize EnhancedReactTestAgent:', error);
            this.memoryInitialized = true;
        }
    }
    /**
     * Синхронизирует память агента с менеджером памяти
     */
    async syncMemoryWithManager() {
        const managerMemory = await this.memoryManager.loadMemory();
        // Копируем данные из менеджера в память агента
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
        // Добавляем enhanced данные
        return {
            ...baseReport,
            memory: {
                testExecutions: this.memoryManager.getTestHistory().length,
                cachedComponents: this.memory.cache?.componentAnalysis?.size || 0,
                performance: this.memory.performance,
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
    isInitialized() {
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
    async updateProjectContext(updates) {
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
    async clearMemory() {
        if (!this.memoryInitialized) {
            await this.initialize();
        }
        // Очищаем память менеджера
        await this.memoryManager.clear();
        // Очищаем память родителя
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
    // Приватные вспомогательные методы
    /**
     * Генерирует полный набор тестов для компонента с использованием памяти
     */
    async generateCompleteTests(componentCode, componentPath) {
        // Инициализируем память если еще не инициализирована
        if (!this.memoryInitialized) {
            await this.initialize();
        }
        console.log(`🚀 Запускаю enhanced генерацию тестов для: ${componentPath}`);
        // Проверяем кэш перед анализом
        if (this.memoryManager.isCacheValid(componentPath)) {
            console.log(`📁 Использую кэшированный анализ для: ${componentPath}`);
            const cached = this.memoryManager.getCachedAnalysis(componentPath);
            if (cached) {
                console.log(`🎯 Найден кэшированный анализ (возраст: ${this.getCacheAge(cached.timestamp)}ms)`);
            }
        }
        const startTime = Date.now();
        try {
            // Используем память для поиска похожих компонентов
            const similarComponents = await this.memoryManager.findSimilarComponents(componentCode);
            // Используем унаследованный метод analyzeComponent
            const analysis = await this.analyzeComponent(componentCode);
            const bestPractices = this.memoryManager.getBestPractices(analysis.componentType);
            const commonErrors = this.memoryManager.getCommonErrors(analysis.complexity);
            const memoryContext = this.buildContextFromMemory(similarComponents, bestPractices, commonErrors);
            console.log(`🧠 Использую контекст из ${similarComponents.length} похожих компонентов`);
            // 1. Анализ компонента (уже выполнен выше)
            // 2. Планирование тестирования с учетом памяти
            const plan = await this.generateEnhancedPlan(componentCode, analysis, memoryContext);
            // 3. Генерация тестов с учетом памяти
            const { testCases, testCode } = await this.generateEnhancedTests(componentCode, analysis, plan, memoryContext);
            const duration = Date.now() - startTime;
            // 4. Сохранение в память
            await this.recordSuccessfulExecution(componentCode, componentPath, { plan, analysis, testCases, testCode, filePath: this.getTestFilePath(componentPath) }, duration);
            // ИСПРАВЛЕННАЯ СТРОКА: Используем Map метод set вместо индексного доступа
            this.memory.componentAnalysis.set(componentPath, {
                ...analysis,
                hash: this.generateCodeHash(componentCode) // Добавляем hash для расширенного типа
            });
            console.log(`✅ Enhanced тесты сгенерированы для: ${componentPath} (${duration}ms)`);
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
            console.error(`❌ Ошибка enhanced генерации тестов для ${componentPath}:`, error);
            // Записываем неудачное выполнение
            await this.recordFailedExecution(componentCode, componentPath, error, duration);
            throw error;
        }
    }
    /**
     * Получает расширенный анализ компонента (включая hash и историю)
     */
    getEnhancedComponentAnalysis(componentPath) {
        return this.memory.componentAnalysis.get(componentPath);
    }
    /**
     * Получает компоненты по hash
     */
    getComponentsByHash(hash) {
        const components = [];
        this.memory.componentAnalysis.forEach((analysis) => {
            if (analysis.hash === hash) {
                components.push(analysis);
            }
        });
        return components;
    }
    /**
     * Записывает успешное выполнение в память
     */
    async recordSuccessfulExecution(componentCode, componentPath, result, duration) {
        const execution = {
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
        // Используем родительский метод для записи в базовую память
        this.recordTestExecution(execution);
        // Дополнительно записываем в MemoryManager
        await this.memoryManager.recordTestExecution(execution);
    }
    /**
     * Записывает неудачное выполнение в память
     */
    async recordFailedExecution(componentCode, componentPath, error, duration) {
        const execution = {
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
                error: error instanceof Error ? error.message : 'Unknown error', // Исправлено: error вместо errors
                duration,
                testsPassed: 0,
                testsFailed: 0
            }
        };
        // Используем родительский метод для записи в базовую память
        this.recordTestExecution(execution);
        // Дополнительно записываем в MemoryManager
        await this.memoryManager.recordTestExecution(execution);
    }
    /**
     * Генерирует улучшенный план тестирования с учетом памяти
     */
    async generateEnhancedPlan(componentCode, analysis, memoryContext) {
        // Здесь можно добавить логику улучшенного планирования
        // Пока используем базовый планировщик
        return this.planner.plan(componentCode, analysis);
    }
    /**
     * Генерирует улучшенные тесты с учетом памяти
     */
    async generateEnhancedTests(componentCode, analysis, plan, memoryContext) {
        // Здесь можно добавить логику улучшенной генерации тестов
        // Пока используем базовый генератор
        return this.testGenerator.execute({
            componentCode,
            analysis,
            framework: `${this.config.testFramework} + ${this.config.testingLibrary}`
        });
    }
    /**
     * Строит контекст из памяти
     */
    buildContextFromMemory(similarComponents, bestPractices, commonErrors) {
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
    generateRecommendations() {
        const recommendations = [];
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
    analyzeTrends() {
        const history = this.memoryManager.getTestHistory();
        if (history.length < 2)
            return { trend: 'stable', description: 'Недостаточно данных для анализа трендов' };
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
    calculateRecentSuccessRate(history) {
        const recent = history.slice(-10); // Последние 10 выполнений
        if (recent.length === 0)
            return 0;
        const successful = recent.filter(exec => exec.result.success).length;
        return successful / recent.length;
    }
    /**
     * Получает возраст кэша в миллисекундах
     */
    getCacheAge(timestamp) {
        return Date.now() - timestamp.getTime();
    }
}
//# sourceMappingURL=enhanced-react-test-agent.js.map