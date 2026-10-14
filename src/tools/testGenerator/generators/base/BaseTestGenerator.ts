// src/tools/testGenerator/base/BaseTestGenerator.ts
import { ITestGenerator, TestGenerationInput, TestGenerationOutput, TestType } from "../../types";
import { LLMProvider, ComponentAnalysis } from "../../../../types/agent";
import { DEFAULT_EXTENSIONS, DEFAULT_DEPENDENCIES } from "../../constants";

export abstract class BaseTestGenerator implements ITestGenerator {
    abstract readonly name: string;
    abstract readonly type: TestType;
    abstract readonly description: string;

    private promptCache = new Map<string, string>();
    private cacheTTL = 3600000;

    constructor(protected llm: LLMProvider) {}

    async generate(input: TestGenerationInput): Promise<TestGenerationOutput> {
        try {
            this.validateInput(input);

            const prompt = await this.getCachedPrompt(input);
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
            throw new Error(`Failed to generate ${this.type} tests: ${error}`);
        }
    }

    abstract isApplicable(analysis: ComponentAnalysis): boolean;
    protected abstract buildPrompt(input: TestGenerationInput): string;

    protected validateInput(input: TestGenerationInput): void {
        if (!input.componentCode) {
            throw new Error('componentCode is required');
        }
        if (!input.componentPath) {
            throw new Error('componentPath is required');
        }
        if (!input.analysis) {
            throw new Error('analysis is required');
        }
    }

    private async getCachedPrompt(input: TestGenerationInput): Promise<string> {
        const key = this.generateCacheKey(input);

        if (this.promptCache.has(key)) {
            const cached = this.promptCache.get(key)!;
            const [, timestamp] = key.split('_');
            if (Date.now() - parseInt(timestamp) < this.cacheTTL) {
                return cached;
            }
            this.promptCache.delete(key);
        }

        const prompt = this.buildPrompt(input);
        this.promptCache.set(key, prompt);
        return prompt;
    }

    private generateCacheKey(input: TestGenerationInput): string {
        const hash = this.hashCode(input.componentCode);
        return `${this.type}_${hash}_${Date.now()}`;
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

    protected cleanTestCode(code: string): string {
        let cleaned = code;
        cleaned = cleaned.replace(/```(?:typescript|tsx|ts|jsx|js)?\s*/g, '');
        cleaned = cleaned.replace(/```\s*/g, '');
        cleaned = cleaned.trim();
        return cleaned;
    }

    protected countTestCases(code: string): number {
        const matches = code.match(/(?:it|test)\(['"][^'"]+['"],/g);
        return matches ? matches.length : 0;
    }

    protected getFileName(componentName: string): string {
        return `${componentName}.${DEFAULT_EXTENSIONS[this.type]}`;
    }

    protected getDependencies(): string[] {
        return DEFAULT_DEPENDENCIES[this.type] || [];
    }

    protected getMocks(analysis: ComponentAnalysis): string[] {
        return [];
    }

    protected getSetupFiles(componentName: string): string[] {
        return [];
    }

    clearCache(): void {
        this.promptCache.clear();
    }
}