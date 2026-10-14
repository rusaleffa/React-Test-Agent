export class DeepSeekProvider {
    constructor(apiKey, config = {
        temperature: 0.3,
        maxTokens: 4000
    }) {
        this.apiKey = apiKey;
        this.config = config;
    }
    async generate(prompt, context = '') {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
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
            }),
        });
        if (!response.ok) {
            throw new Error(`LLM Request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data.choices[0].message.content;
    }
    async generateStructured(prompt, schema) {
        const systemPrompt = `
      Ты должен вернуть ответ в формате JSON строго по этой схеме:
      ${JSON.stringify(schema, null, 2)}
      
      Верни ТОЛЬКО JSON без каких-либо дополнительных объяснений.
    `;
        const result = await this.generate(prompt, systemPrompt);
        try {
            // Ищем JSON в ответе (на случай если модель добавила текст)
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(result);
        }
        catch (error) {
            throw new Error(`Failed to parse LLM response as JSON: ${error}`);
        }
    }
    async analyze(code, context) {
        const prompt = `
      Проанализируй этот React-компонент:
      ${code}
      
      Контекст: ${context}
    `;
        return this.generate(prompt, 'Ты эксперт по анализу кода React компонентов.');
    }
}
//# sourceMappingURL=deepseek-provider.js.map