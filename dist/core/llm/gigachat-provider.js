export class GigaChatProvider {
    constructor(clientId, clientSecret, config = {
        temperature: 0.3,
        maxTokens: 4000
    }) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.config = config;
        this.accessToken = null;
        this.tokenExpiry = null;
    }
    /**
     * Получение OAuth токена для GigaChat API
     */
    async getAccessToken() {
        // Проверяем, не истек ли текущий токен
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }
        try {
            // Используем Basic авторизацию с Client ID и Secret
            const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
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
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to get GigaChat token: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            if (!data.access_token) {
                throw new Error('No access_token in response');
            }
            // Сохраняем токен и время истечения (обычно 30 минут)
            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in || 1800) * 1000;
            console.log('✅ GigaChat token obtained successfully');
            return this.accessToken;
        }
        catch (error) {
            console.error('❌ GigaChat authentication failed:', error);
            throw new Error(`GigaChat authentication failed: ${error}`);
        }
    }
    /**
     * Генерация UUID для RqUID заголовка
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    async generate(prompt, context = '') {
        const token = await this.getAccessToken();
        try {
            const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    model: 'GigaChat:latest',
                    messages: [
                        {
                            role: 'system',
                            content: `Ты экспертный помощник по тестированию React приложений. ${context}`,
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: this.config.temperature,
                    max_tokens: this.config.maxTokens,
                    stream: false,
                    repetition_penalty: 1.0,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('GigaChat API error:', response.status, errorText);
                throw new Error(`GigaChat request failed: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error('Unexpected GigaChat response:', data);
                throw new Error('Unexpected response structure from GigaChat');
            }
            return data.choices[0].message.content;
        }
        catch (error) {
            // Если ошибка связана с токеном, сбрасываем его и пробуем еще раз
            if (error instanceof Error && error.message.includes('401')) {
                console.log('🔄 Token expired, refreshing...');
                this.accessToken = null;
                this.tokenExpiry = null;
                return this.generate(prompt, context);
            }
            throw error;
        }
    }
    async generateStructured(prompt, schema) {
        const systemPrompt = `
      Ты должен вернуть ответ в формате JSON строго по этой схеме:
      ${JSON.stringify(schema, null, 2)}
      
      Верни ТОЛЬКО JSON без каких-либо дополнительных объяснений.
      Убедись, что все поля соответствуют схеме.
    `;
        const result = await this.generate(prompt, systemPrompt);
        try {
            // Ищем JSON в ответе
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(result);
        }
        catch (error) {
            // Пробуем очистить ответ от маркеров кода
            const cleaned = result.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            try {
                return JSON.parse(cleaned);
            }
            catch (secondError) {
                console.error('Failed to parse JSON from response:', result);
                throw new Error(`Failed to parse GigaChat response as JSON: ${error}`);
            }
        }
    }
    async analyze(code, context) {
        const prompt = `
      Проанализируй этот React-компонент:
      ${code}
      
      Контекст: ${context}
      
      Предоставь анализ по следующим категориям:
      1. Тип компонента (functional/class)
      2. Используемые хуки
      3. Пропсы
      4. Состояния
      5. Побочные эффекты
      6. Сложность (low/medium/high)
      7. Рекомендации по тестированию
    `;
        return this.generate(prompt, 'Ты эксперт по анализу кода React компонентов.');
    }
    /**
     * Проверка доступности API
     */
    async testConnection() {
        try {
            await this.getAccessToken();
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Обновление конфигурации
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
//# sourceMappingURL=gigachat-provider.js.map