import { BaseTestGenerator } from './base/BaseTestGenerator';
import { TestGenerationInput, TestType } from '../types';
import { ComponentAnalysis } from '../../../types/agent';

export class IntegrationTestGenerator extends BaseTestGenerator {
    readonly name = 'IntegrationTestGenerator';
    readonly type = TestType.INTEGRATION;
    readonly description = 'Интеграционные тесты для проверки взаимодействия с зависимостями';

    isApplicable(analysis: ComponentAnalysis): boolean {
        // Обязательно приводим к числу — иначе strict-TS ругается на `undefined > 0`
        const hasDeps = (analysis.dependencies?.length ?? 0) > 0;
        const hasEffects = (analysis.effects?.length ?? 0) > 0;
        const hasNetwork = (analysis.networkCalls?.length ?? 0) > 0;
        const hasContext = (analysis.contextUsages?.length ?? 0) > 0;
        const hasRedux = (analysis.reduxSlices?.length ?? 0) > 0;
        return hasDeps || hasEffects || hasNetwork || hasContext || hasRedux;
    }

    protected buildPrompt(input: TestGenerationInput): string {
        const { componentName, componentCode, analysis } = input;
        const {
            props = [],
            states = [],
            effects = [],
            events = [],
            dependencies = [],
            networkCalls = [],
            contextUsages = [],
            reduxSlices = [],
            subComponents = []
        } = analysis;

        const requiredProps = props.filter(p => p.required);
        const requiredPropsHint = requiredProps.length > 0
            ? `\n⚠️ Обязательные пропсы (ОБЯЗАТЕЛЬНО передавай в JSX, иначе тест не скомпилируется): ${requiredProps.map(p => `${p.name}: ${p.type}`).join(', ')}\n`
            : '';

        const apiMocksSection = networkCalls.length > 0 ? `
## API-МОКИ (MSW v2):
Используй **актуальный API MSW v2** (\`http\` и \`HttpResponse\`). Не используй устаревший \`rest\`/\`ctx\`/\`res\`.
Создай моки для:
${networkCalls.map(c => `- ${c.method.toUpperCase()} ${c.url}`).join('\n')}

Пример:
\`\`\`typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
    http.get('${networkCalls[0]?.url || '/api/**'}', () => {
        return HttpResponse.json({ data: 'mock' });
    })
);
\`\`\`
` : '';

        const contextSection = contextUsages.length > 0 ? `
## КОНТЕКСТЫ:
Компонент использует: ${contextUsages.join(', ')}.
Оберни компонент в соответствующие провайдеры.
` : '';

        const reduxSection = reduxSlices.length > 0 ? `
## REDUX:
Слайсы: ${reduxSlices.join(', ')}.
Используй \`configureStore\` (Redux Toolkit) или \`redux-mock-store\`.
` : '';

        const subSection = subComponents.length > 0 ? `
## ДОЧЕРНИЕ КОМПОНЕНТЫ:
Присутствуют: ${subComponents.join(', ')}. Проверь, что они получают корректные пропсы.
` : '';

        return `Ты эксперт по интеграционному тестированию React компонентов.

## КОМПОНЕНТ: ${componentName}
${componentCode}

## АНАЛИЗ:
- Пропсы: ${props.map(p => `${p.name}: ${p.type}${p.required ? ' (required)' : ''}`).join(', ') || 'нет'}
- Состояния: ${states.map(s => s.name).join(', ') || 'нет'}
- Эффекты: ${effects.length}
- События: ${events.map(e => e.name).join(', ') || 'нет'}
- Зависимости: ${dependencies.join(', ') || 'нет'}
${requiredPropsHint}
${apiMocksSection}
${contextSection}
${reduxSection}
${subSection}

## ТРЕБОВАНИЯ:
1. Используй **MSW v2** (\`http\`, \`HttpResponse\`) — НЕ v1.
2. Передавай ВСЕ обязательные пропсы компонента.
3. Тестируй: успех, ошибку сети (500), состояние загрузки.
4. Используй \`waitFor\` для асинхронных проверок.
5. Не используй несуществующие селекторы и data-testid.

## ФОРМАТ ВЫВОДА:
Верни ТОЛЬКО код на TypeScript. Первая строка — \`import ...\`. Без markdown-обёртки и пояснений.`;
    }

    protected getMocks(analysis: ComponentAnalysis): string[] {
        const mocks: string[] = [];
        if (analysis.networkCalls?.length) mocks.push('msw');
        if (analysis.reduxSlices?.length) mocks.push('redux-mock-store');
        return mocks;
    }

    protected getSetupFiles(_componentName: string): string[] {
        return [this.generateSetupFile()];
    }

    private generateSetupFile(): string {
        return `// Глобальный setup для интеграционных тестов (MSW v2)
import { setupServer } from 'msw/node';

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
`;
    }
}