import { BasePlanner } from '../core/base-interfaces';
export class TestPlanner extends BasePlanner {
    constructor(llm) {
        super();
        this.llm = llm;
    }
    async plan(componentCode, analysis) {
        const schema = {
            type: 'object',
            properties: {
                componentType: { type: 'string' },
                testPriority: { type: 'string', enum: ['high', 'medium', 'low'] },
                requiredTests: {
                    type: 'array',
                    items: { type: 'string' }
                },
                dependencies: {
                    type: 'array',
                    items: { type: 'string' }
                },
                estimatedTime: { type: 'string' },
                riskAreas: {
                    type: 'array',
                    items: { type: 'string' }
                }
            },
            required: ['componentType', 'testPriority', 'requiredTests']
        };
        const plan = await this.llm.generateStructured(`Создай план тестирования для React компонента.
      
      Код компонента: 
      ${componentCode}
      
      Анализ компонента: 
      - Пропсы: ${analysis.props.map(p => `${p.name}: ${p.type}`).join(', ')}
      - Состояния: ${analysis.states.map(s => s.name).join(', ')}
      - Эффекты: ${analysis.effects.length}
      - Сложность: ${analysis.complexity}
      
      Учти:
      - Компоненты с большим количеством пропсов требуют больше тестов
      - Состояния нужно тестировать на изменения
      - Эффекты нужно тестировать на выполнение и cleanup
      - Обработчики событий нужно тестировать на вызов`, schema);
        return plan;
    }
}
//# sourceMappingURL=test-planner.js.map