import { BaseTool } from '../core/base-interfaces';
export class ComponentAnalyzerTool extends BaseTool {
    constructor(llm) {
        super();
        this.llm = llm;
        this.name = 'component_analyzer';
        this.description = 'Анализирует React компонент и извлекает метаинформацию';
    }
    async execute(input) {
        const schema = {
            type: 'object',
            properties: {
                props: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            type: { type: 'string' },
                            required: { type: 'boolean' },
                            defaultValue: { type: 'string', optional: true }
                        }
                    }
                },
                states: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            type: { type: 'string' },
                            initialValue: { type: 'string' }
                        }
                    }
                },
                effects: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            dependencies: { type: 'array', items: { type: 'string' } },
                            purpose: { type: 'string' }
                        }
                    }
                },
                events: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            parameters: { type: 'array', items: { type: 'string' } }
                        }
                    }
                },
                dependencies: { type: 'array', items: { type: 'string' } },
                complexity: { type: 'string', enum: ['low', 'medium', 'high'] },
                componentType: { type: 'string' }
            },
            required: ['props', 'states', 'effects', 'events', 'dependencies', 'complexity', 'componentType']
        };
        return this.llm.generateStructured(`Проанализируй React компонент и верни структурированные данные:\n\n${input.code}`, schema);
    }
}
export class TestGeneratorTool extends BaseTool {
    constructor(llm) {
        super();
        this.llm = llm;
        this.name = 'test_generator';
        this.description = 'Генерирует тесты для React компонента';
    }
    async execute(input) {
        const testCases = await this.llm.generate(`На основе анализа компонента сгенерируй тест-кейсы:
      
      Анализ: ${JSON.stringify(input.analysis, null, 2)}
      
      Сгенерируй список тест-кейсов в формате массива строк.`);
        const testCode = await this.llm.generate(`Напиши готовые тесты на ${input.framework} для React компонента:
      
      Компонент: ${input.componentCode}
      
      Тест-кейсы: ${testCases}
      
      Требования:
      - Используй современные best practices
      - Добавь комментарии
      - Включи все необходимые импорты
      - Mock внешние зависимости
      - Используй user-event для симуляции пользовательских действий`);
        return {
            testCases: testCases.split('\n').filter(line => line.trim()),
            testCode
        };
    }
}
//# sourceMappingURL=index.js.map