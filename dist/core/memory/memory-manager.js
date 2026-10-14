import { FileSystemStorage } from './storage';
export class MemoryManager {
    constructor(storage = new FileSystemStorage()) {
        this.initialized = false;
        this.storage = storage;
        this.memory = this.getDefaultMemory();
        this.initialized = false;
    }
    /**
     * Инициализирует менеджер памяти
     */
    async initialize() {
        if (this.initialized) {
            return;
        }
        try {
            console.log('🔄 Initializing MemoryManager...');
            this.memory = await this.loadMemory();
            this.initialized = true;
            console.log('✅ MemoryManager initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize MemoryManager:', error);
            this.initialized = true;
        }
    }
    /**
     * Проверяет, инициализирован ли менеджер памяти
     */
    isInitialized() {
        return this.initialized;
    }
    /**
     * Записывает выполнение теста в память
     */
    async recordTestExecution(execution) {
        await this.ensureInitialized();
        const executionWithId = {
            ...execution,
            id: this.generateId(),
            timestamp: new Date()
        };
        this.memory.testHistory.push(executionWithId);
        await this.updateComponentAnalysis(execution.componentPath, execution.input.code, executionWithId.id);
        await this.updatePatterns(executionWithId);
        this.updatePerformanceMetrics(executionWithId);
        await this.saveMemory();
        return executionWithId.id;
    }
    /**
     * Ищет похожие компоненты
     */
    // Исправленный метод:
    async findSimilarComponents(currentComponentCode) {
        await this.ensureInitialized();
        const currentHash = this.generateCodeHash(currentComponentCode);
        const currentAnalysis = this.analyzeComponentStructure(currentComponentCode);
        const similarities = [];
        this.memory.componentAnalysis.forEach((analysis, path) => {
            if (analysis.hash === currentHash) {
                const lastTestId = analysis.testHistory?.[analysis.testHistory.length - 1];
                const execution = lastTestId ?
                    this.memory.testHistory.find(t => t.id === lastTestId) :
                    undefined;
                if (execution) {
                    similarities.push({
                        component: analysis,
                        similarity: 1.0,
                        testExecution: execution
                    });
                }
            }
            else {
                const similarity = this.calculateComponentSimilarity(currentAnalysis, analysis);
                if (similarity > 0.7) {
                    const lastTestId = analysis.testHistory?.[analysis.testHistory.length - 1];
                    const execution = lastTestId ?
                        this.memory.testHistory.find(t => t.id === lastTestId) :
                        undefined;
                    if (execution) {
                        similarities.push({
                            component: analysis,
                            similarity,
                            testExecution: execution
                        });
                    }
                }
            }
        });
        return similarities.sort((a, b) => b.similarity - a.similarity);
    }
    /**
     * Получает лучшие практики для типа компонента
     */
    getBestPractices(componentType) {
        this.ensureInitializedSync();
        const patterns = this.memory.patterns?.testPatterns || [];
        return patterns
            .filter(pattern => pattern.applicableTo.includes(componentType) ||
            pattern.applicableTo.includes('any'))
            .sort((a, b) => {
            const scoreA = (a.successRate * 0.7) + (a.usageCount * 0.3);
            const scoreB = (b.successRate * 0.7) + (b.usageCount * 0.3);
            return scoreB - scoreA;
        })
            .slice(0, 5);
    }
    /**
     * Получает частые ошибки для сложности компонента
     */
    getCommonErrors(componentComplexity) {
        this.ensureInitializedSync();
        const errors = this.memory.patterns?.errorPatterns || [];
        return errors
            .filter(error => error.occurrenceCount > 2 &&
            this.isErrorRelevantForComplexity(error, componentComplexity))
            .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
    }
    /**
     * Получает метрики производительности
     */
    getPerformanceMetrics() {
        this.ensureInitializedSync();
        return this.memory.performance;
    }
    /**
     * Получает контекст проекта
     */
    getProjectContext() {
        this.ensureInitializedSync();
        return this.memory.projectContext;
    }
    /**
     * Обновляет контекст проекта
     */
    updateProjectContext(updates) {
        this.ensureInitializedSync();
        this.memory.projectContext = {
            ...this.memory.projectContext,
            ...updates
        };
        this.saveMemory();
    }
    /**
     * Получает историю тестов
     */
    getTestHistory() {
        this.ensureInitializedSync();
        return [...this.memory.testHistory];
    }
    /**
     * Получает анализ компонента
     */
    getComponentAnalysis(componentPath) {
        this.ensureInitializedSync();
        return this.memory.componentAnalysis.get(componentPath);
    }
    /**
     * Получает все компоненты
     */
    getAllComponents() {
        this.ensureInitializedSync();
        return new Map(this.memory.componentAnalysis);
    }
    /**
     * Получает кэшированный анализ
     */
    getCachedAnalysis(componentPath) {
        this.ensureInitializedSync();
        return this.memory.cache?.componentAnalysis.get(componentPath);
    }
    /**
     * Проверяет валидность кэша
     */
    isCacheValid(componentPath, maxAgeMinutes = 60) {
        this.ensureInitializedSync();
        const cached = this.getCachedAnalysis(componentPath);
        if (!cached)
            return false;
        const age = Date.now() - cached.timestamp.getTime();
        return age <= maxAgeMinutes * 60 * 1000;
    }
    /**
     * Получает размер кэша
     */
    getCacheSize() {
        this.ensureInitializedSync();
        return this.memory.cache?.componentAnalysis.size || 0;
    }
    /**
     * Получает количество паттернов
     */
    getPatternsCount() {
        this.ensureInitializedSync();
        return {
            testPatterns: this.memory.patterns?.testPatterns.length || 0,
            errorPatterns: this.memory.patterns?.errorPatterns.length || 0
        };
    }
    /**
     * Очищает память
     */
    async clear() {
        await this.ensureInitialized();
        this.memory = this.getDefaultMemory();
        await this.saveMemory();
    }
    /**
     * Добавляет паттерн тестирования
     */
    addTestPattern(pattern) {
        this.ensureInitializedSync();
        const newPattern = {
            ...pattern,
            id: this.generatePatternId()
        };
        if (!this.memory.patterns) {
            this.memory.patterns = {
                testPatterns: [],
                errorPatterns: [],
                bestPractices: [],
                antiPatterns: []
            };
        }
        this.memory.patterns.testPatterns.push(newPattern);
        this.saveMemory();
    }
    /**
     * Добавляет паттерн ошибки
     */
    addErrorPattern(error) {
        this.ensureInitializedSync();
        const newError = {
            ...error,
            id: this.generateErrorId()
        };
        if (!this.memory.patterns) {
            this.memory.patterns = {
                testPatterns: [],
                errorPatterns: [],
                bestPractices: [],
                antiPatterns: []
            };
        }
        this.memory.patterns.errorPatterns.push(newError);
        this.saveMemory();
    }
    // Приватные методы
    async ensureInitialized() {
        if (!this.initialized) {
            await this.initialize();
        }
    }
    ensureInitializedSync() {
        if (!this.initialized) {
            console.warn('⚠️ MemoryManager accessed before initialization. Using default memory.');
        }
    }
    async updateComponentAnalysis(componentPath, componentCode, testExecutionId) {
        const analysis = await this.analyzeComponentForMemory(componentCode);
        const existingAnalysis = this.memory.componentAnalysis.get(componentPath);
        if (existingAnalysis) {
            // Теперь existingAnalysis имеет тип ComponentAnalysisWithMemory, поэтому hash доступен
            if (!existingAnalysis.testHistory) {
                existingAnalysis.testHistory = [];
            }
            existingAnalysis.testHistory.push(testExecutionId);
            existingAnalysis.hash = analysis.hash;
            // Обновляем остальные поля анализа
            Object.assign(existingAnalysis, {
                props: analysis.props,
                states: analysis.states,
                effects: analysis.effects,
                events: analysis.events,
                dependencies: analysis.dependencies,
                complexity: analysis.complexity,
                componentType: analysis.componentType
            });
        }
        else {
            // Создаем новую запись с расширенным типом
            this.memory.componentAnalysis.set(componentPath, {
                ...analysis,
                testHistory: [testExecutionId]
            });
        }
        this.updateCache(componentPath, analysis);
    }
    async analyzeComponentForMemory(componentCode) {
        const hash = this.generateCodeHash(componentCode);
        const structure = this.analyzeComponentStructure(componentCode);
        return {
            ...structure,
            hash
        };
    }
    updateCache(componentPath, analysis) {
        if (!this.memory.cache) {
            this.memory.cache = {
                componentAnalysis: new Map(),
                testPatterns: new Map(),
                errorPatterns: new Map()
            };
        }
        this.memory.cache.componentAnalysis.set(componentPath, {
            analysis,
            timestamp: new Date()
        });
    }
    async updatePatterns(execution) {
        if (execution.result.success) {
            const patterns = this.extractPatternsFromTests(execution.output.testCode);
            patterns.forEach(pattern => this.recordSuccessfulPattern(pattern, execution));
        }
        else {
            const errors = this.analyzeErrors(execution.result.error ? [execution.result.error] : []);
            errors.forEach(error => this.recordErrorPattern(error, execution));
        }
    }
    updatePerformanceMetrics(execution) {
        if (!this.memory.performance) {
            this.memory.performance = {
                averageGenerationTime: 0,
                successRate: 0,
                coverageTrend: [],
                componentComplexityCorrelation: {},
                toolUsage: {}
            };
        }
        const history = this.memory.testHistory;
        const successfulExecutions = history.filter(e => e.result.success);
        this.memory.performance = {
            averageGenerationTime: history.reduce((sum, e) => sum + e.result.duration, 0) / history.length,
            successRate: history.length > 0 ? successfulExecutions.length / history.length : 0,
            coverageTrend: successfulExecutions.map(e => e.result.coverage || 0),
            componentComplexityCorrelation: this.calculateComplexityCorrelation(),
            toolUsage: this.calculateToolUsage()
        };
    }
    calculateComplexityCorrelation() {
        const correlation = {};
        const complexities = ['low', 'medium', 'high'];
        complexities.forEach(complexity => {
            const components = Array.from(this.memory.componentAnalysis.values())
                .filter(comp => comp.complexity === complexity);
            if (components.length > 0) {
                const executions = this.memory.testHistory.filter(exec => {
                    return Array.from(this.memory.componentAnalysis.entries())
                        .some(([path, comp]) => {
                        const compWithHistory = comp;
                        return compWithHistory.testHistory?.includes(exec.id);
                    });
                });
                const successful = executions.filter(e => e.result.success);
                const avgTime = executions.length > 0 ?
                    executions.reduce((sum, e) => sum + e.result.duration, 0) / executions.length : 0;
                correlation[complexity] = {
                    successRate: executions.length > 0 ? successful.length / executions.length : 0,
                    averageTime: avgTime
                };
            }
        });
        return correlation;
    }
    calculateToolUsage() {
        // Заглушка - в реальной реализации нужно отслеживать использование инструментов
        return {};
    }
    generateCodeHash(code) {
        let hash = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    calculateComponentSimilarity(comp1, comp2) {
        let score = 0;
        const maxScore = 5;
        if (comp1.props.length > 0 && comp2.props.length > 0) {
            const propOverlap = comp1.props.filter(p1 => comp2.props.some(p2 => p1.name === p2.name && p1.type === p2.type)).length;
            score += (propOverlap / Math.max(comp1.props.length, comp2.props.length));
        }
        if (comp1.states.length > 0 && comp2.states.length > 0) {
            const stateOverlap = comp1.states.filter(s1 => comp2.states.some(s2 => s1.name === s2.name)).length;
            score += (stateOverlap / Math.max(comp1.states.length, comp2.states.length));
        }
        if (comp1.complexity === comp2.complexity) {
            score += 1;
        }
        const depOverlap = comp1.dependencies.filter(d => comp2.dependencies.includes(d)).length;
        score += (depOverlap / Math.max(comp1.dependencies.length, comp2.dependencies.length));
        if (comp1.componentType === comp2.componentType) {
            score += 1;
        }
        return score / maxScore;
    }
    analyzeComponentStructure(code) {
        const props = this.extractProps(code);
        const states = this.extractStates(code);
        const effects = this.extractEffects(code);
        const events = this.extractEvents(code);
        const dependencies = this.extractDependencies(code);
        return {
            props,
            states,
            effects,
            events,
            dependencies,
            complexity: this.calculateComplexity(props, states, effects),
            componentType: this.determineComponentType(code)
        };
    }
    extractProps(code) {
        const propMatches = code.match(/const\s+{([^}]+)}\s*=\s*props/g) ||
            code.match(/interface\s+\w+\s*{([^}]+)}/g) ||
            code.match(/type\s+\w+\s*=\s*{([^}]+)}/g);
        if (!propMatches)
            return [];
        return propMatches[0]
            .split(',')
            .map(prop => prop.trim())
            .filter(prop => prop)
            .map(prop => ({
            name: prop.split(':')[0]?.replace('?', '').trim() || prop,
            type: 'any',
            required: !prop.includes('?'),
            defaultValue: undefined
        }));
    }
    extractStates(code) {
        const stateMatches = code.match(/useState\([^)]+\)/g) || [];
        return stateMatches.map((match, index) => ({
            name: `state${index}`,
            type: 'any',
            initialValue: match
        }));
    }
    extractEffects(code) {
        const effectMatches = code.match(/useEffect\([^)]+\)/g) || [];
        return effectMatches.map((match, index) => ({
            dependencies: [],
            purpose: `effect${index}`
        }));
    }
    extractEvents(code) {
        const eventMatches = code.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g) ||
            code.match(/function\s+(\w+)\s*\([^)]*\)/g) ||
            code.match(/(\w+)\s*=\s*\([^)]*\)\s*=>/g);
        return eventMatches?.map(match => ({
            name: match.split('=')[0]?.replace('const', '').trim() || 'unknown',
            parameters: []
        })) || [];
    }
    extractDependencies(code) {
        const importMatches = code.match(/from\s+['"]([^'"]+)['"]/g) || [];
        return importMatches.map(match => match.replace(/from\s+['"]([^'"]+)['"]/, '$1'));
    }
    determineComponentType(code) {
        if (code.includes('useState'))
            return 'stateful';
        if (code.includes('useEffect'))
            return 'effectful';
        if (code.includes('props'))
            return 'presentational';
        return 'static';
    }
    calculateComplexity(props, states, effects) {
        const score = props.length + states.length * 2 + effects.length * 1.5;
        if (score > 10)
            return 'high';
        if (score > 5)
            return 'medium';
        return 'low';
    }
    isErrorRelevantForComplexity(error, complexity) {
        const complexityWeights = {
            low: ['syntax'],
            medium: ['syntax', 'logic'],
            high: ['syntax', 'logic', 'performance', 'coverage']
        };
        return complexityWeights[complexity]?.includes(error.type) || false;
    }
    extractPatternsFromTests(testCode) {
        const patterns = [];
        if (testCode.includes('fireEvent'))
            patterns.push({ type: 'user_interaction' });
        if (testCode.includes('async'))
            patterns.push({ type: 'async_operations' });
        if (testCode.includes('mock'))
            patterns.push({ type: 'mocking' });
        if (testCode.includes('queryBy'))
            patterns.push({ type: 'query_assertions' });
        return patterns;
    }
    analyzeErrors(errors) {
        return errors.map(error => ({
            type: this.classifyError(error),
            description: error,
            solution: this.suggestSolution(error)
        }));
    }
    classifyError(error) {
        const errorLower = error.toLowerCase();
        if (errorLower.includes('syntax') || errorLower.includes('parsing') || error.includes('Unexpected token')) {
            return 'syntax';
        }
        if (errorLower.includes('type') || errorLower.includes('cannot read') || errorLower.includes('undefined')) {
            return 'logic';
        }
        if (errorLower.includes('timeout') || errorLower.includes('performance') || errorLower.includes('slow')) {
            return 'performance';
        }
        if (errorLower.includes('coverage') || errorLower.includes('not covered') || errorLower.includes('missing test')) {
            return 'coverage';
        }
        if (errorLower.includes('import') || errorLower.includes('module') || errorLower.includes('dependency')) {
            return 'dependency';
        }
        return 'unknown';
    }
    suggestSolution(error) {
        const errorLower = error.toLowerCase();
        if (errorLower.includes('syntax')) {
            return 'Проверьте синтаксис JavaScript/JSX, убедитесь в правильности закрывающих скобок и кавычек';
        }
        if (errorLower.includes('type')) {
            return 'Проверьте типы пропсов и состояний, убедитесь в правильности передаваемых значений';
        }
        if (errorLower.includes('cannot read') || errorLower.includes('undefined')) {
            return 'Проверьте инициализацию переменных и наличие необходимых свойств в объектах';
        }
        if (errorLower.includes('timeout')) {
            return 'Увеличьте таймауты тестов или оптимизируйте производительность компонента';
        }
        if (errorLower.includes('import') || errorLower.includes('module')) {
            return 'Проверьте правильность импортов и наличие установленных зависимостей';
        }
        return 'Пересмотрите подход к тестированию, проверьте документацию по тестированию React компонентов';
    }
    recordSuccessfulPattern(pattern, execution) {
        const existingPattern = this.memory.patterns?.testPatterns?.find(p => p.name === pattern.type);
        if (existingPattern) {
            existingPattern.usageCount++;
            existingPattern.successRate = (existingPattern.successRate * existingPattern.usageCount + 1) / (existingPattern.usageCount + 1);
        }
        else {
            this.addTestPattern({
                name: pattern.type,
                description: `Автоматически обнаруженный паттерн для ${pattern.type}`,
                codeExample: this.extractRelevantCodeExample(execution.output.testCode, pattern.type),
                usageCount: 1,
                successRate: 1.0,
                applicableTo: [execution.input.config.testFramework || 'any'],
                tags: [pattern.type, 'auto-generated']
            });
        }
    }
    recordErrorPattern(error, execution) {
        const existingError = this.memory.patterns?.errorPatterns?.find(e => e.description === error.description);
        if (existingError) {
            existingError.occurrenceCount++;
            existingError.lastOccurred = new Date();
            if (!existingError.components.includes(execution.componentPath)) {
                existingError.components.push(execution.componentPath);
            }
        }
        else {
            this.addErrorPattern({
                type: error.type,
                description: error.description,
                solution: error.solution,
                occurrenceCount: 1,
                components: [execution.componentPath],
                lastOccurred: new Date()
            });
        }
    }
    extractRelevantCodeExample(testCode, patternType) {
        const lines = testCode.split('\n');
        switch (patternType) {
            case 'user_interaction':
                const interactionLine = lines.find(line => line.includes('fireEvent') || line.includes('userEvent'));
                return interactionLine ? `// Пример взаимодействия:\n${interactionLine.trim()}` : testCode.slice(0, 200);
            case 'async_operations':
                const asyncLine = lines.find(line => line.includes('async') || line.includes('await'));
                return asyncLine ? `// Пример асинхронной операции:\n${asyncLine.trim()}` : testCode.slice(0, 200);
            case 'mocking':
                const mockLine = lines.find(line => line.includes('mock') || line.includes('jest.mock'));
                return mockLine ? `// Пример мокинга:\n${mockLine.trim()}` : testCode.slice(0, 200);
            default:
                return testCode.slice(0, 200) + '...';
        }
    }
    generateId() {
        return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generatePatternId() {
        return `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }
    generateErrorId() {
        return `error_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }
    async loadMemory() {
        try {
            const loadedMemory = await this.storage.load();
            console.log('📁 Memory loaded from storage');
            return this.ensureMemoryStructure(loadedMemory);
        }
        catch (error) {
            console.warn('Failed to load memory from storage, using default:', error);
            return this.getDefaultMemory();
        }
    }
    async saveMemory() {
        try {
            // Просто передаем текущую память в storage
            // Storage сам разберется с сериализацией
            await this.storage.save(this.memory);
        }
        catch (error) {
            console.error('Failed to save memory:', error);
        }
    }
    getDefaultMemory() {
        return {
            testHistory: [],
            componentAnalysis: new Map(),
            commonPatterns: [],
            errorPatterns: [],
            patterns: {
                testPatterns: [],
                errorPatterns: [],
                bestPractices: [],
                antiPatterns: []
            },
            performance: {
                averageGenerationTime: 0,
                successRate: 0,
                coverageTrend: [],
                componentComplexityCorrelation: {},
                toolUsage: {}
            },
            projectContext: {
                techStack: [],
                testingPreferences: {},
                commonPatterns: []
            },
            cache: {
                componentAnalysis: new Map(),
                testPatterns: new Map(),
                errorPatterns: new Map()
            }
        };
    }
    ensureMemoryStructure(memory) {
        const defaultMemory = this.getDefaultMemory();
        let componentAnalysis;
        if (memory.componentAnalysis instanceof Map) {
            componentAnalysis = memory.componentAnalysis;
        }
        else if (Array.isArray(memory.componentAnalysis)) {
            componentAnalysis = new Map(memory.componentAnalysis);
        }
        else if (typeof memory.componentAnalysis === 'object') {
            componentAnalysis = new Map(Object.entries(memory.componentAnalysis));
        }
        else {
            componentAnalysis = defaultMemory.componentAnalysis;
        }
        // Убеждаемся, что все обязательные поля присутствуют
        return {
            testHistory: memory.testHistory || defaultMemory.testHistory,
            componentAnalysis,
            commonPatterns: memory.commonPatterns || defaultMemory.commonPatterns,
            errorPatterns: memory.errorPatterns || defaultMemory.errorPatterns,
            patterns: memory.patterns || defaultMemory.patterns,
            performance: memory.performance || defaultMemory.performance,
            projectContext: memory.projectContext || defaultMemory.projectContext,
            cache: memory.cache || defaultMemory.cache
        };
    }
}
//# sourceMappingURL=memory-manager.js.map