// src/core/memory/memory-manager.ts
import {
    AgentMemory,
    TestExecution,
    ComponentAnalysis,
    TestPattern,
    ErrorPattern,
    PerformanceMetrics,
    ProjectContext,
    MemoryCache,
    TestPlan, ComponentAnalysisWithMemory
} from '../../types/agent';
import { FileSystemStorage, MemoryStorage } from './storage';

export class MemoryManager {
    private memory: AgentMemory;
    private storage: MemoryStorage;
    private initialized: boolean = false;

    constructor(storage: MemoryStorage = new FileSystemStorage()) {
        this.storage = storage;
        this.memory = this.getDefaultMemory();
        this.initialized = false;
    }

    /**
     * Инициализирует менеджер памяти
     */
    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        try {
            console.log('🔄 Initializing MemoryManager...');
            this.memory = await this.loadMemory();
            this.initialized = true;
            console.log('✅ MemoryManager initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize MemoryManager:', error);
            this.initialized = true;
        }
    }

    /**
     * Проверяет, инициализирован ли менеджер памяти
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Записывает выполнение теста в память
     */
    async recordTestExecution(execution: Omit<TestExecution, 'id'>): Promise<string> {
        await this.ensureInitialized();

        const executionWithId: TestExecution = {
            ...execution,
            id: this.generateId(),
            timestamp: new Date()
        };

        this.memory.testHistory.push(executionWithId);

        await this.updateComponentAnalysis(
            execution.componentPath,
            execution.input.code,
            executionWithId.id
        );

        await this.updatePatterns(executionWithId);

        this.updatePerformanceMetrics(executionWithId);

        await this.saveMemory();

        return executionWithId.id;
    }

    /**
     * Ищет похожие компоненты
     */
    async findSimilarComponents(currentComponentCode: string): Promise<{
        component: ComponentAnalysisWithMemory;
        similarity: number;
        testExecution: TestExecution;
    }[]> {
        await this.ensureInitialized();

        const currentHash = this.generateCodeHash(currentComponentCode);
        const currentAnalysis = this.analyzeComponentStructure(currentComponentCode);
        const similarities: Array<{
            component: ComponentAnalysisWithMemory;
            similarity: number;
            testExecution: TestExecution;
        }> = [];

        this.memory.componentAnalysis.forEach((analysis: ComponentAnalysisWithMemory, path: string) => {
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
            } else {
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
    getBestPractices(componentType: string): TestPattern[] {
        this.ensureInitializedSync();

        const patterns = this.memory.patterns?.testPatterns || [];
        return patterns
            .filter(pattern =>
                pattern.applicableTo.includes(componentType) ||
                pattern.applicableTo.includes('any')
            )
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
    getCommonErrors(componentComplexity: string): ErrorPattern[] {
        this.ensureInitializedSync();

        const errors = this.memory.patterns?.errorPatterns || [];
        return errors
            .filter(error =>
                error.occurrenceCount > 2 &&
                this.isErrorRelevantForComplexity(error, componentComplexity)
            )
            .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
    }

    /**
     * Получает метрики производительности
     */
    getPerformanceMetrics(): PerformanceMetrics {
        this.ensureInitializedSync();
        return this.memory.performance!;
    }

    /**
     * Получает контекст проекта
     */
    getProjectContext(): ProjectContext {
        this.ensureInitializedSync();
        return this.memory.projectContext!;
    }

    /**
     * Обновляет контекст проекта
     */
    updateProjectContext(updates: Partial<ProjectContext>): void {
        this.ensureInitializedSync();
        this.memory.projectContext = {
            ...this.memory.projectContext!,
            ...updates
        };
        this.saveMemory();
    }

    /**
     * Получает историю тестов
     */
    getTestHistory(): TestExecution[] {
        this.ensureInitializedSync();
        return [...this.memory.testHistory];
    }

    /**
     * Получает анализ компонента
     */
    getComponentAnalysis(componentPath: string): ComponentAnalysis | undefined {
        this.ensureInitializedSync();
        return this.memory.componentAnalysis.get(componentPath);
    }

    /**
     * Получает все компоненты
     */
    getAllComponents(): Map<string, ComponentAnalysis> {
        this.ensureInitializedSync();
        return new Map(this.memory.componentAnalysis);
    }

    /**
     * Получает кэшированный анализ
     */
    getCachedAnalysis(componentPath: string): { analysis: ComponentAnalysis; timestamp: Date } | undefined {
        this.ensureInitializedSync();
        const cached = this.memory.cache?.componentAnalysis.get(componentPath);
        if (!cached) return undefined;

        // Приводим timestamp к Date (на случай, если он сохранился как строка)
        let timestamp: Date;
        if (cached.timestamp instanceof Date) {
            timestamp = cached.timestamp;
        } else if (typeof cached.timestamp === 'string' || typeof cached.timestamp === 'number') {
            timestamp = new Date(cached.timestamp);
        } else {
            // Если не удалось преобразовать, возвращаем undefined (кеш повреждён)
            return undefined;
        }

        // Проверяем валидность даты
        if (isNaN(timestamp.getTime())) {
            return undefined;
        }

        return {
            analysis: cached.analysis,
            timestamp
        };
    }

    /**
     * Проверяет валидность кэша
     */
    isCacheValid(componentPath: string, maxAgeMinutes: number = 60): boolean {
        this.ensureInitializedSync();
        const cached = this.getCachedAnalysis(componentPath);
        if (!cached) return false;

        // timestamp уже приведён к Date в getCachedAnalysis, но на всякий случай
        const timestamp = cached.timestamp;
        if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
            console.warn(`⚠️ Invalid timestamp for ${componentPath}, cache invalid`);
            return false;
        }

        console.log('Cache timestamp:', timestamp.toISOString());
        console.log('Current time:', new Date().toISOString());

        const age = Date.now() - timestamp.getTime();
        const isValid = age <= maxAgeMinutes * 60 * 1000;

        console.log(`Cache age: ${Math.round(age / 60000)} minutes, Valid: ${isValid}`);

        return isValid;
    }

    /**
     * Получает размер кэша
     */
    getCacheSize(): number {
        this.ensureInitializedSync();
        return this.memory.cache?.componentAnalysis.size || 0;
    }

    /**
     * Получает количество паттернов
     */
    getPatternsCount(): { testPatterns: number; errorPatterns: number } {
        this.ensureInitializedSync();
        return {
            testPatterns: this.memory.patterns?.testPatterns.length || 0,
            errorPatterns: this.memory.patterns?.errorPatterns.length || 0
        };
    }

    /**
     * Очищает память
     */
    async clear(): Promise<void> {
        await this.ensureInitialized();
        this.memory = this.getDefaultMemory();
        await this.saveMemory();
    }

    /**
     * Добавляет паттерн тестирования
     */
    addTestPattern(pattern: Omit<TestPattern, 'id'>): void {
        this.ensureInitializedSync();

        const newPattern: TestPattern = {
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
    addErrorPattern(error: Omit<ErrorPattern, 'id'>): void {
        this.ensureInitializedSync();

        const newError: ErrorPattern = {
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

    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }
    }

    private ensureInitializedSync(): void {
        if (!this.initialized) {
            console.warn('⚠️ MemoryManager accessed before initialization. Using default memory.');
        }
    }

    private async updateComponentAnalysis(
        componentPath: string,
        componentCode: string,
        testExecutionId: string
    ): Promise<void> {
        const analysis = await this.analyzeComponentForMemory(componentCode);

        const existingAnalysis = this.memory.componentAnalysis.get(componentPath);
        if (existingAnalysis) {
            if (!existingAnalysis.testHistory) {
                existingAnalysis.testHistory = [];
            }
            existingAnalysis.testHistory.push(testExecutionId);
            existingAnalysis.hash = analysis.hash as string;

            Object.assign(existingAnalysis, {
                props: analysis.props,
                states: analysis.states,
                effects: analysis.effects,
                events: analysis.events,
                dependencies: analysis.dependencies,
                complexity: analysis.complexity,
                componentType: analysis.componentType
            });
        } else {
            this.memory.componentAnalysis.set(componentPath, {
                ...analysis,
                testHistory: [testExecutionId]
            });
        }

        this.updateCache(componentPath, analysis);
    }

    private async analyzeComponentForMemory(componentCode: string): Promise<ComponentAnalysisWithMemory> {
        const hash = this.generateCodeHash(componentCode);
        const structure = this.analyzeComponentStructure(componentCode);

        return {
            ...structure,
            hash
        };
    }

    private updateCache(componentPath: string, analysis: ComponentAnalysis): void {
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

    private async updatePatterns(execution: TestExecution): Promise<void> {
        if (execution.result.success) {
            const patterns = this.extractPatternsFromTests(execution.output.testCode);
            patterns.forEach(pattern => this.recordSuccessfulPattern(pattern, execution));
        } else {
            const errors = this.analyzeErrors(execution.result.error ? [execution.result.error] : []);
            errors.forEach(error => this.recordErrorPattern(error, execution));
        }
    }

    private updatePerformanceMetrics(execution: TestExecution): void {
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

    private calculateComplexityCorrelation(): Record<string, { successRate: number; averageTime: number }> {
        const correlation: Record<string, { successRate: number; averageTime: number }> = {};
        const complexities = ['low', 'medium', 'high'];

        complexities.forEach(complexity => {
            const components = Array.from(this.memory.componentAnalysis.values())
                .filter(comp => comp.complexity === complexity);

            if (components.length > 0) {
                const executions = this.memory.testHistory.filter(exec => {
                    return Array.from(this.memory.componentAnalysis.entries())
                        .some(([path, comp]) => {
                            const compWithHistory = comp as ComponentAnalysis & { testHistory?: string[] };
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

    private calculateToolUsage(): Record<string, { count: number; successRate: number; averageTime: number }> {
        return {};
    }

    private generateCodeHash(code: string): string {
        let hash = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    private calculateComponentSimilarity(comp1: ComponentAnalysis, comp2: ComponentAnalysis): number {
        let score = 0;
        const maxScore = 5;

        if (comp1.props.length > 0 && comp2.props.length > 0) {
            const propOverlap = comp1.props.filter(p1 =>
                comp2.props.some(p2 => p1.name === p2.name && p1.type === p2.type)
            ).length;
            score += (propOverlap / Math.max(comp1.props.length, comp2.props.length));
        }

        if (comp1.states.length > 0 && comp2.states.length > 0) {
            const stateOverlap = comp1.states.filter(s1 =>
                comp2.states.some(s2 => s1.name === s2.name)
            ).length;
            score += (stateOverlap / Math.max(comp1.states.length, comp2.states.length));
        }

        if (comp1.complexity === comp2.complexity) {
            score += 1;
        }

        const depOverlap = comp1.dependencies.filter(d =>
            comp2.dependencies.includes(d)
        ).length;
        score += (depOverlap / Math.max(comp1.dependencies.length, comp2.dependencies.length));

        if (comp1.componentType === comp2.componentType) {
            score += 1;
        }

        return score / maxScore;
    }

    private analyzeComponentStructure(code: string): ComponentAnalysis {
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

    private extractProps(code: string): any[] {
        const propMatches = code.match(/const\s+{([^}]+)}\s*=\s*props/g) ||
            code.match(/interface\s+\w+\s*{([^}]+)}/g) ||
            code.match(/type\s+\w+\s*=\s*{([^}]+)}/g);

        if (!propMatches) return [];

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

    private extractStates(code: string): any[] {
        const stateMatches = code.match(/useState\([^)]+\)/g) || [];
        return stateMatches.map((match, index) => ({
            name: `state${index}`,
            type: 'any',
            initialValue: match
        }));
    }

    private extractEffects(code: string): any[] {
        const effectMatches = code.match(/useEffect\([^)]+\)/g) || [];
        return effectMatches.map((match, index) => ({
            dependencies: [],
            purpose: `effect${index}`
        }));
    }

    private extractEvents(code: string): any[] {
        const eventMatches = code.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g) ||
            code.match(/function\s+(\w+)\s*\([^)]*\)/g) ||
            code.match(/(\w+)\s*=\s*\([^)]*\)\s*=>/g);

        return eventMatches?.map(match => ({
            name: match.split('=')[0]?.replace('const', '').trim() || 'unknown',
            parameters: []
        }))||[];
    }

    private extractDependencies(code: string): string[] {
        const importMatches = code.match(/from\s+['"]([^'"]+)['"]/g) || [];
        return importMatches.map(match =>
            match.replace(/from\s+['"]([^'"]+)['"]/, '$1')
        );
    }

    private determineComponentType(code: string): string {
        if (code.includes('useState')) return 'stateful';
        if (code.includes('useEffect')) return 'effectful';
        if (code.includes('props')) return 'presentational';
        return 'static';
    }

    private calculateComplexity(props: any[], states: any[], effects: any[]): 'low' | 'medium' | 'high' {
        const score = props.length + states.length * 2 + effects.length * 1.5;
        if (score > 10) return 'high';
        if (score > 5) return 'medium';
        return 'low';
    }

    private isErrorRelevantForComplexity(error: ErrorPattern, complexity: string): boolean {
        const complexityWeights = {
            low: ['syntax'],
            medium: ['syntax', 'logic'],
            high: ['syntax', 'logic', 'performance', 'coverage']
        };

        return complexityWeights[complexity as keyof typeof complexityWeights]?.includes(error.type) || false;
    }

    private extractPatternsFromTests(testCode: string): any[] {
        const patterns: any[] = [];

        if (testCode.includes('fireEvent')) patterns.push({ type: 'user_interaction' });
        if (testCode.includes('async')) patterns.push({ type: 'async_operations' });
        if (testCode.includes('mock')) patterns.push({ type: 'mocking' });
        if (testCode.includes('queryBy')) patterns.push({ type: 'query_assertions' });

        return patterns;
    }

    private analyzeErrors(errors: string[]): Array<{ type: string; description: string; solution: string }> {
        return errors.map(error => ({
            type: this.classifyError(error),
            description: error,
            solution: this.suggestSolution(error)
        }));
    }

    private classifyError(error: string): string {
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

    private suggestSolution(error: string): string {
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

    private recordSuccessfulPattern(pattern: any, execution: TestExecution): void {
        const existingPattern = this.memory.patterns?.testPatterns?.find(p =>
            p.name === pattern.type
        );

        if (existingPattern) {
            existingPattern.usageCount++;
            existingPattern.successRate = (existingPattern.successRate * existingPattern.usageCount + 1) / (existingPattern.usageCount + 1);
        } else {
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

    private recordErrorPattern(error: any, execution: TestExecution): void {
        const existingError = this.memory.patterns?.errorPatterns?.find(e =>
            e.description === error.description
        );

        if (existingError) {
            existingError.occurrenceCount++;
            existingError.lastOccurred = new Date();
            if (!existingError.components.includes(execution.componentPath)) {
                existingError.components.push(execution.componentPath);
            }
        } else {
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

    private extractRelevantCodeExample(testCode: string, patternType: string): string {
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

    private generateId(): string {
        return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generatePatternId(): string {
        return `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }

    private generateErrorId(): string {
        return `error_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }

    async loadMemory(): Promise<AgentMemory> {
        try {
            const loadedMemory = await this.storage.load();
            console.log('📁 Memory loaded from storage');
            return this.ensureMemoryStructure(loadedMemory);
        } catch (error) {
            console.warn('Failed to load memory from storage, using default:', error);
            return this.getDefaultMemory();
        }
    }

    private async saveMemory(): Promise<void> {
        try {
            await this.storage.save(this.memory);
        } catch (error) {
            console.error('Failed to save memory:', error);
        }
    }

    private getDefaultMemory(): AgentMemory {
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

    private ensureMemoryStructure(memory: any): AgentMemory {
        const defaultMemory = this.getDefaultMemory();

        let componentAnalysis: Map<string, ComponentAnalysisWithMemory>;
        if (memory.componentAnalysis instanceof Map) {
            componentAnalysis = memory.componentAnalysis;
        } else if (Array.isArray(memory.componentAnalysis)) {
            componentAnalysis = new Map(memory.componentAnalysis);
        } else if (typeof memory.componentAnalysis === 'object') {
            componentAnalysis = new Map(Object.entries(memory.componentAnalysis));
        } else {
            componentAnalysis = defaultMemory.componentAnalysis;
        }

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