import { ITestGenerator, TestGenerationInput, TestGenerationOutput, TestType } from '../../types';
import { LLMProvider, ComponentAnalysis } from '../../../../types/agent';
import { DEFAULT_EXTENSIONS, DEFAULT_DEPENDENCIES } from '../../constants';

export abstract class BaseTestGenerator implements ITestGenerator {
    abstract readonly name: string;
    abstract readonly type: TestType;
    abstract readonly description: string;

    // Кэш промптов с TTL (по умолчанию — 1 час)
    private promptCache = new Map<string, { prompt: string; timestamp: number }>();
    private readonly cacheTTL: number;

    constructor(protected llm: LLMProvider, cacheTTL: number = 3_600_000) {
        this.cacheTTL = cacheTTL;
    }

    // Общая точка входа: строит промпт, получает ответ LLM, чистит его
    async generate(input: TestGenerationInput): Promise<TestGenerationOutput> {
        try {
            this.validateInput(input);

            const prompt = this.getCachedPrompt(input);
            const response = await this.llm.generate(prompt);
            const testCode = this.cleanTestCode(response);
            const testCount = this.countTestCases(testCode);

            return {
                testCode,
                testFileName: this.getFileName(input.componentName),
                testDir: this.type,
                testType: this.type,
                description: `${this.description} для ${input.componentName}`,
                dependencies: this.getDependencies(),
                mocks: this.getMocks(input.analysis),
                setupFiles: this.getSetupFiles(input.componentName),
                metadata: {
                    generatedAt: new Date(),
                    componentName: input.componentName,
                    testCount
                }
            };
        } catch (error) {
            throw new Error(`Не удалось сгенерировать ${this.type} тесты: ${error}`);
        }
    }

    abstract isApplicable(analysis: ComponentAnalysis): boolean;
    protected abstract buildPrompt(input: TestGenerationInput): string;

    // Базовая проверка входных данных — обязательные поля
    protected validateInput(input: TestGenerationInput): void {
        if (!input.componentCode) throw new Error('componentCode обязателен');
        if (!input.componentPath) throw new Error('componentPath обязателен');
        if (!input.analysis) throw new Error('analysis обязателен');
    }

    // Возвращает промпт из кэша, если он ещё свежий, иначе строит заново.
    // Ключ кэша детерминированный (хэш кода компонента), а не по времени,
    // иначе кэш никогда не срабатывал бы.
    private getCachedPrompt(input: TestGenerationInput): string {
        const key = this.generateCacheKey(input);
        const cached = this.promptCache.get(key);

        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached.prompt;
        }

        const prompt = this.buildPrompt(input);
        this.promptCache.set(key, { prompt, timestamp: Date.now() });
        return prompt;
    }

    private generateCacheKey(input: TestGenerationInput): string {
        return `${this.type}_${this.hashCode(input.componentCode)}`;
    }

    private hashCode(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    // Убирает markdown-обёртки и текст, который LLM иногда добавляет перед кодом
    protected cleanTestCode(code: string): string {
        let cleaned = code;

        cleaned = cleaned.replace(/```(?:typescript|tsx|ts|jsx|js)?\s*/g, '');
        cleaned = cleaned.replace(/```\s*/g, '');

        // Отрезаем всё до первой реальной конструкции кода
        const firstConstruct = cleaned.search(
            /(?:^|\n)\s*(?:import|export|describe|test|it|const|let|var|function|class)\s/
        );
        if (firstConstruct > 0) {
            cleaned = cleaned.substring(firstConstruct).replace(/^\s+/, '');
        }

        return cleaned.trim();
    }

    // Считает количество блоков it(...) / test(...)
    protected countTestCases(code: string): number {
        const matches = code.match(/(?:it|test)\s*\(\s*['"][^'"]+['"]\s*[,)]/g);
        return matches ? matches.length : 0;
    }

    protected getFileName(componentName: string): string {
        return `${componentName}.${DEFAULT_EXTENSIONS[this.type]}`;
    }

    protected getDependencies(): string[] {
        return DEFAULT_DEPENDENCIES[this.type] || [];
    }

    // Переопределяется наследниками, если нужны моки
    protected getMocks(_analysis: ComponentAnalysis): string[] {
        return [];
    }

    // Переопределяется наследниками, если нужны setup-файлы
    protected getSetupFiles(_componentName: string): string[] {
        return [];
    }

    clearCache(): void {
        this.promptCache.clear();
    }
}