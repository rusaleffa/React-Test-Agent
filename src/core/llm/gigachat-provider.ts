import { LLMProvider } from '../../types/agent.js';
import https from 'https';

export class GigaChatProvider implements LLMProvider {
    // Токен кэшируется статически — разделяется между экземплярами провайдера
    private static accessToken: string | null = null;
    private static tokenExpiry: number | null = null;

    private httpsAgent: https.Agent;
    private readonly MAX_RETRIES = 5;
    private readonly INITIAL_RETRY_DELAY = 1000;

    constructor(
        private clientId: string,
        private clientSecret: string,
        private config: { temperature: number; maxTokens: number } = {
            temperature: 0.3,
            maxTokens: 4000
        }
    ) {
        this.httpsAgent = new https.Agent({
            rejectUnauthorized: false,
            keepAlive: true,
        });
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Обёртка над fetch с ретраями при 429 и сетевых ошибках
    private async fetchWithRetry(
        url: string,
        options: RequestInit,
        retries: number = 0
    ): Promise<Response> {
        try {
            const response = await fetch(url, options);

            if (response.status === 429 && retries < this.MAX_RETRIES) {
                const delay = this.INITIAL_RETRY_DELAY * Math.pow(2, retries);
                console.warn(`⏳ Rate limit (429). Повтор через ${delay}мс... (попытка ${retries + 1}/${this.MAX_RETRIES})`);
                await this.sleep(delay);
                return this.fetchWithRetry(url, options, retries + 1);
            }
            return response;
        } catch (error) {
            if (retries < this.MAX_RETRIES) {
                const delay = this.INITIAL_RETRY_DELAY * Math.pow(2, retries);
                console.warn(`⚠️ Сетевая ошибка. Повтор через ${delay}мс... (попытка ${retries + 1}/${this.MAX_RETRIES})`);
                await this.sleep(delay);
                return this.fetchWithRetry(url, options, retries + 1);
            }
            throw error;
        }
    }

    // Получение OAuth-токена с кэшированием до истечения срока
    private async getAccessToken(): Promise<string> {
        if (GigaChatProvider.accessToken && GigaChatProvider.tokenExpiry && Date.now() < GigaChatProvider.tokenExpiry) {
            return GigaChatProvider.accessToken;
        }

        try {
            const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            const response = await this.fetchWithRetry('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'RqUID': this.generateUUID(),
                },
                body: new URLSearchParams({
                    'scope': 'GIGACHAT_API_PERS',
                    'grant_type': 'client_credentials',
                }).toString(),
                // @ts-expect-error — Node.js поддерживает agent в fetch, но стандартные типы его не знают
                agent: this.httpsAgent,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            if (!data.access_token) {
                throw new Error('В ответе нет access_token');
            }

            GigaChatProvider.accessToken = data.access_token as string;
            GigaChatProvider.tokenExpiry = Date.now() + (data.expires_in || 1800) * 1000;
            console.log('✅ Токен GigaChat получен (закэширован глобально)');
            return GigaChatProvider.accessToken;
        } catch (error) {
            console.error('❌ Ошибка авторизации GigaChat:', error);
            throw error;
        }
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async generate(prompt: string, context: string = ''): Promise<string> {
        const token = await this.getAccessToken();
        const payload = {
            model: 'GigaChat',
            messages: [
                { role: 'system', content: `Ты эксперт по тестированию React. ${context}` },
                { role: 'user', content: prompt },
            ],
            temperature: this.config.temperature,
            max_tokens: this.config.maxTokens,
            stream: false,
        };

        try {
            const response = await this.fetchWithRetry('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
                // @ts-expect-error — Node.js поддерживает agent в fetch, но стандартные типы его не знают
                agent: this.httpsAgent,
            });

            if (!response.ok) {
                const errorText = await response.text();
                // Если токен протух — сбрасываем кэш и пробуем ещё раз
                if (response.status === 401) {
                    GigaChatProvider.accessToken = null;
                    GigaChatProvider.tokenExpiry = null;
                    return this.generate(prompt, context);
                }
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            if (!data.choices?.[0]?.message?.content) {
                throw new Error('Неожиданная структура ответа');
            }
            return data.choices[0].message.content;
        } catch (error) {
            if (error instanceof Error && error.message.includes('401')) {
                GigaChatProvider.accessToken = null;
                GigaChatProvider.tokenExpiry = null;
                return this.generate(prompt, context);
            }
            throw error;
        }
    }

    async generateStructured<T>(prompt: string, schema: any): Promise<T> {
        const systemPrompt = `
      Ты должен вернуть ответ в формате JSON строго по этой схеме:
      ${JSON.stringify(schema, null, 2)}

      Верни ТОЛЬКО JSON без каких-либо дополнительных объяснений.
      НЕ добавляй текст до или после JSON.
      НЕ используй markdown-разметку.
      Убедись, что все поля соответствуют схеме.
    `;
        const result = await this.generate(prompt, systemPrompt);
        return this.extractJSONFromResponse<T>(result);
    }

    // Аккуратный парсинг JSON: снимаем markdown-обёртки и вытаскиваем подстроку
    private extractJSONFromResponse<T>(response: string): T {
        let cleaned = response
            .replace(/```json\s*/g, '')
            .replace(/```javascript\s*/g, '')
            .replace(/```js\s*/g, '')
            .replace(/```\s*/g, '');

        let jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) jsonMatch = cleaned.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]) as T;
            } catch {
                // идём дальше — попробуем более аккуратный разбор
            }
        }

        // Отрезаем всё до первой фигурной скобки/квадратной скобки и после последней
        const startBrace = cleaned.indexOf('{');
        const startBracket = cleaned.indexOf('[');
        let start = -1;
        if (startBrace !== -1 && startBracket !== -1) start = Math.min(startBrace, startBracket);
        else if (startBrace !== -1) start = startBrace;
        else if (startBracket !== -1) start = startBracket;
        if (start !== -1) cleaned = cleaned.substring(start);

        const lastBrace = cleaned.lastIndexOf('}');
        const lastBracket = cleaned.lastIndexOf(']');
        let end = -1;
        if (lastBrace !== -1 && lastBracket !== -1) end = Math.max(lastBrace, lastBracket);
        else if (lastBrace !== -1) end = lastBrace;
        else if (lastBracket !== -1) end = lastBracket;
        if (end !== -1) cleaned = cleaned.substring(0, end + 1);

        try {
            return JSON.parse(cleaned) as T;
        } catch (e) {
            // Последняя попытка: ищем вложенные объекты регуляркой
            const jsonRegex = /\{[^{}]*\{[^{}]*\}[^{}]*\}|\{[^{}]*\}/g;
            const matches = cleaned.match(jsonRegex);
            if (matches) {
                for (const match of matches) {
                    try {
                        return JSON.parse(match) as T;
                    } catch {
                        // пробуем следующее вхождение
                    }
                }
            }
            console.error('❌ Не удалось распарсить JSON:', response.substring(0, 500));
            throw new Error(`Ошибка парсинга JSON: ${e}`);
        }
    }

    async analyze(code: string, context: string): Promise<any> {
        const prompt = `Проанализируй React-компонент:\n${code}`;
        return this.generate(prompt, context);
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.getAccessToken();
            return true;
        } catch {
            return false;
        }
    }
}