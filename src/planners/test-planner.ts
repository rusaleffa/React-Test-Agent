// src/planners/test-planner.ts
import { Planner, TestPlan, ComponentAnalysis, LLMProvider } from '../types/agent.js';
import { BasePlanner } from '../core/base-interfaces.js';

export class TestPlanner extends BasePlanner implements Planner {
    constructor(private llm: LLMProvider) {
        super();
    }

    async plan(componentCode: string, analysis: ComponentAnalysis): Promise<TestPlan> {
        // Безопасная проверка всех полей с новыми опциональными
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

        console.log('📊 Анализ для планирования (расширенный):', {
            propsCount: safeAnalysis.props.length,
            statesCount: safeAnalysis.states.length,
            effectsCount: safeAnalysis.effects.length,
            complexity: safeAnalysis.complexity,
            subComponents: safeAnalysis.subComponents.length,
            networkCalls: safeAnalysis.networkCalls.length,
            contextUsages: safeAnalysis.contextUsages.length,
            reduxSlices: safeAnalysis.reduxSlices.length,
        });

        // Автоматическое определение приоритета на основе новых полей
        let priority: 'high' | 'medium' | 'low' = 'medium';
        const riskAreas: string[] = [];

        if (safeAnalysis.networkCalls.length > 0) {
            priority = 'high';
            riskAreas.push('Внешние API вызовы требуют мокинга');
        }
        if (safeAnalysis.contextUsages.length > 0) {
            if (priority !== 'high') priority = 'high';
            riskAreas.push('Контексты требуют правильной настройки в тестах');
        }
        if (safeAnalysis.reduxSlices.length > 0) {
            if (priority !== 'high') priority = 'high';
            riskAreas.push('Redux состояние требует мокинга store');
        }
        if (safeAnalysis.subComponents.length > 2) {
            if (priority === 'medium') priority = 'high';
            riskAreas.push(`Множество дочерних компонентов (${safeAnalysis.subComponents.length}) требуют проверки пропсов`);
        }
        if (safeAnalysis.complexity === 'high') {
            if (priority === 'medium') priority = 'high';
            riskAreas.push('Высокая сложность компонента требует тщательного покрытия');
        }

        if (riskAreas.length === 0) {
            riskAreas.push('Стандартный компонент без явных рисков');
        }

        // Базовые требуемые тесты
        const requiredTests = [
            'Рендеринг компонента',
            'Проверка пропсов',
            'Тестирование состояний'
        ];

        if (safeAnalysis.networkCalls.length > 0) {
            requiredTests.push('Тестирование API вызовов (успех/ошибка)');
        }
        if (safeAnalysis.contextUsages.length > 0) {
            requiredTests.push('Тестирование с контекстом');
        }
        if (safeAnalysis.reduxSlices.length > 0) {
            requiredTests.push('Тестирование с Redux store');
        }
        if (safeAnalysis.subComponents.length > 0) {
            requiredTests.push('Взаимодействие с дочерними компонентами');
        }
        if (safeAnalysis.events.length > 0) {
            requiredTests.push('Обработка событий');
        }

        // Используем LLM для уточнения плана, но уже с нашими дополнениями
        try {
            const schema = {
                type: 'object',
                properties: {
                    componentType: { type: 'string' },
                    testPriority: { type: 'string', enum: ['high', 'medium', 'low'] },
                    requiredTests: { type: 'array', items: { type: 'string' } },
                    dependencies: { type: 'array', items: { type: 'string' } },
                    estimatedTime: { type: 'string' },
                    riskAreas: { type: 'array', items: { type: 'string' } }
                },
                required: ['componentType', 'testPriority', 'requiredTests']
            };

            const propsStr = safeAnalysis.props.map((p: any) => `${p.name}: ${p.type}`).join(', ') || 'нет';
            const statesStr = safeAnalysis.states.map((s: any) => s.name).join(', ') || 'нет';

            const prompt = `Создай план тестирования для React компонента.

Код компонента (первые 500 символов): 
${componentCode.substring(0, 500)}...

Анализ компонента (включая расширенные данные): 
- Тип: ${safeAnalysis.componentType}
- Сложность: ${safeAnalysis.complexity}
- Пропсы: ${propsStr}
- Состояния: ${statesStr}
- Эффекты: ${safeAnalysis.effects.length}
- Зависимости: ${safeAnalysis.dependencies.join(', ') || 'нет'}
- Вложенные компоненты: ${safeAnalysis.subComponents.join(', ') || 'нет'}
- Сетевые вызовы: ${safeAnalysis.networkCalls.map(c => `${c.method} ${c.url}`).join(', ') || 'нет'}
- Контексты: ${safeAnalysis.contextUsages.join(', ') || 'нет'}
- Redux слайсы: ${safeAnalysis.reduxSlices.join(', ') || 'нет'}

Учти эти расширенные данные для создания более точного плана.
Верни JSON с планом тестирования.`;

            const plan = await this.llm.generateStructured<TestPlan>(prompt, schema);

            // Объединяем наши вычисления с результатом LLM, отдавая приоритет нашим вычислениям для riskAreas и priority
            return {
                componentType: plan.componentType || safeAnalysis.componentType || 'functional',
                testPriority: priority, // используем вычисленный
                requiredTests: plan.requiredTests?.length ? plan.requiredTests : requiredTests,
                dependencies: plan.dependencies?.length ? plan.dependencies : safeAnalysis.dependencies || [],
                estimatedTime: plan.estimatedTime || '5-10 минут',
                riskAreas: riskAreas.length ? riskAreas : plan.riskAreas || ['Нет явных рисков']
            };
        } catch (error) {
            console.error('❌ Ошибка при создании плана, использую дефолтный с расширенными данными:', error);
            // Дефолтный план с нашими вычислениями
            return {
                componentType: safeAnalysis.componentType || 'functional',
                testPriority: priority,
                requiredTests: requiredTests,
                dependencies: safeAnalysis.dependencies || [],
                estimatedTime: '5-10 минут',
                riskAreas: riskAreas.length ? riskAreas : ['Стандартный компонент']
            };
        }
    }
}