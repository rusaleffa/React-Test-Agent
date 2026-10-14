import { LLMProvider } from '../../types/agent.js';
export declare class GigaChatProvider implements LLMProvider {
    private clientId;
    private clientSecret;
    private config;
    private accessToken;
    private tokenExpiry;
    constructor(clientId: string, clientSecret: string, config?: {
        temperature: number;
        maxTokens: number;
    });
    /**
     * Получение OAuth токена для GigaChat API
     */
    private getAccessToken;
    /**
     * Генерация UUID для RqUID заголовка
     */
    private generateUUID;
    generate(prompt: string, context?: string): Promise<string>;
    generateStructured<T>(prompt: string, schema: any): Promise<T>;
    analyze(code: string, context: string): Promise<any>;
    /**
     * Проверка доступности API
     */
    testConnection(): Promise<boolean>;
    /**
     * Обновление конфигурации
     */
    updateConfig(config: Partial<{
        temperature: number;
        maxTokens: number;
    }>): void;
}
