import { Planner, TestPlan, ComponentAnalysis, LLMProvider } from '../types/agent.js';
import { BasePlanner } from '../core/base-interfaces.js';

export class TestPlanner extends BasePlanner implements Planner {
    constructor(private llm: LLMProvider) {
        super();
    }

    async plan(componentCode: string, analysis: ComponentAnalysis): Promise<TestPlan> {
        // Нормализуем входные данные, чтобы не было падений на undefined
        const safeAnalysis = {
            props: analysis?.props || [],
            states: analysis?.states || [],
            effects: analysis?.effects || [],
            events: analysis?.events || [],
            dependencies: analysis?.dependencies || [],
            complexity: analysis?.complexity || 'medium',
            componentType: analysis?.componentType || 'functional',
            subComponents: analysis?.subComponents || [],
            networkCalls: analysis?.networkCalls || [],
            contextUsages: analysis?.contextUsages || [],
            reduxSlices: analysis?.reduxSlices || [],
            externalServices: analysis?.externalServices || [],
        };

        console.log('📊 Анализ для планирования:', {
            propsCount: safeAnalysis.props.length,
            statesCount: safeAnalysis.states.length,
            effectsCount: safeAnalysis.effects.length,
            complexity: safeAnalysis.complexity,
            subComponents: safeAnalysis.subComponents.length,
            networkCalls: safeAnalysis.networkCalls.length,
            contextUsages: safeAnalysis.contextUsages.length,
            reduxSlices: safeAnalysis.reduxSlices.length,
        });

        // Определяем приоритет и риски на основе анализа
        let priority: 'high' | 'medium' | 'low' = 'medium';
        const riskAreas: string[] = [];

        if (safeAnalysis.networkCalls.length > 0) {
            priority = 'high';
            riskAreas.push('Внешние API-вызовы требуют мокинга');
        }
        if (safeAnalysis.contextUsages.length > 0) {
            if (priority !== 'high') priority = 'high';
            riskAreas.push('Контексты требуют правильной настройки в тестах');
        }
        if (safeAnalysis.reduxSlices.length > 0) {
            if (priority !== 'high') priority = 'high';
            riskAreas.push('Redux-состояние требует мокинга store');
        }
        if (safeAnalysis.subComponents.length > 2) {
            if (priority === 'medium') priority = 'high';
            riskAreas.push(`Много дочерних компонентов (${safeAnalysis.subComponents.length})`);
        }
        if (safeAnalysis.complexity === 'high') {
            if (priority === 'medium') priority = 'high';
            riskAreas.push('Высокая сложность компонента требует тщательного покрытия');
        }

        if (riskAreas.length === 0) {
            riskAreas.push('Стандартный компонент без явных рисков');
        }

        const requiredTests = ['Рендеринг компонента', 'Проверка пропсов', 'Тестирование состояний'];
        if (safeAnalysis.networkCalls.length > 0) requiredTests.push('Тестирование API-вызовов');
        if (safeAnalysis.contextUsages.length > 0) requiredTests.push('Тестирование с контекстом');
        if (safeAnalysis.reduxSlices.length > 0) requiredTests.push('Тестирование с Redux store');
        if (safeAnalysis.subComponents.length > 0) requiredTests.push('Взаимодействие с дочерними компонентами');
        if (safeAnalysis.events.length > 0) requiredTests.push('Обработка событий');

        // Уточняем план через LLM, но приоритет и риски оставляем своими
        try {
            const schema = {
                type: 'object',
                properties: {
                    componentType: { type: 'string' },
                    testPriority: { type: 'string', enum: ['high', 'medium', 'low'] },
                    requiredTests: { type: 'array', items: { type: 'string' } },
                    dependencies: { type: 'array', items: { type: 'string' } },
                    estimatedTime: { type: 'string' },
                    riskAreas: { type: 'array', items: { type: 'string' } },
                },
                required: ['componentType', 'testPriority', 'requiredTests'],
            };

            const propsStr = safeAnalysis.props.map(p => `${p.name}: ${p.type}`).join(', ') || 'нет';
            const statesStr = safeAnalysis.states.map(s => s.name).join(', ') || 'нет';

            const prompt = `Составь план тестирования для React-компонента.

Код компонента (первые 500 символов):
${componentCode.substring(0, 500)}...

Анализ компонента:
- Тип: ${safeAnalysis.componentType}
- Сложность: ${safeAnalysis.complexity}
- Пропсы: ${propsStr}
- Состояния: ${statesStr}
- Эффекты: ${safeAnalysis.effects.length}
- Зависимости: ${safeAnalysis.dependencies.join(', ') || 'нет'}
- Вложенные компоненты: ${safeAnalysis.subComponents.join(', ') || 'нет'}
- Сетевые вызовы: ${safeAnalysis.networkCalls.map(c => `${c.method} ${c.url}`).join(', ') || 'нет'}
- Контексты: ${safeAnalysis.contextUsages.join(', ') || 'нет'}
- Redux-слайсы: ${safeAnalysis.reduxSlices.join(', ') || 'нет'}

Верни JSON с планом тестирования.`;

            const plan = await this.llm.generateStructured<TestPlan>(prompt, schema);

            return {
                componentType: plan.componentType || safeAnalysis.componentType,
                testPriority: priority,
                requiredTests: plan.requiredTests?.length ? plan.requiredTests : requiredTests,
                dependencies: plan.dependencies?.length ? plan.dependencies : safeAnalysis.dependencies,
                estimatedTime: plan.estimatedTime || '5-10 минут',
                riskAreas: riskAreas.length ? riskAreas : plan.riskAreas || ['Нет явных рисков'],
            };
        } catch (error) {
            console.error('❌ Не удалось получить план от LLM, используем дефолтный:', error);
            return {
                componentType: safeAnalysis.componentType,
                testPriority: priority,
                requiredTests,
                dependencies: safeAnalysis.dependencies,
                estimatedTime: '5-10 минут',
                riskAreas: riskAreas.length ? riskAreas : ['Стандартный компонент'],
            };
        }
    }
}