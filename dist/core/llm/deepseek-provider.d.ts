import { LLMProvider } from './llm-provider';
export declare class DeepSeekProvider implements LLMProvider {
    private apiKey;
    private config;
    constructor(apiKey: string, config?: {
        temperature: number;
        maxTokens: number;
    });
    generate(prompt: string, context?: string): Promise<string>;
    generateStructured<T>(prompt: string, schema: any): Promise<T>;
    analyze(code: string, context: string): Promise<any>;
}
