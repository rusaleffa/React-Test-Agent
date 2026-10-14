// src/tools/testGenerator/generators/IntegrationTestGenerator.ts
import { BaseTestGenerator } from './base/BaseTestGenerator';
import { TestGenerationInput, TestType } from '../types';
import { ComponentAnalysis } from '../../../types/agent';

export class IntegrationTestGenerator extends BaseTestGenerator {
    readonly name = 'IntegrationTestGenerator';
    readonly type = TestType.INTEGRATION;
    readonly description = 'Интеграционные тесты для проверки взаимодействия с зависимостями';

    isApplicable(analysis: ComponentAnalysis): boolean {
        const hasDeps = analysis.dependencies && analysis.dependencies.length > 0;
        const hasEffects = analysis.effects && analysis.effects.length > 0;
        const hasNetwork = analysis.networkCalls && analysis.networkCalls.length > 0;
        const hasContext = analysis.contextUsages && analysis.contextUsages.length > 0;
        const hasRedux = analysis.reduxSlices && analysis.reduxSlices.length > 0;
        return Boolean(hasDeps || hasEffects || hasNetwork || hasContext || hasRedux);
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

        // Секция API-моков (MSW)
        let apiMocksSection = '';
        if (networkCalls.length > 0) {
            apiMocksSection = `
## API МОКИ (MSW):
Создай моки для следующих запросов с использованием MSW:
${networkCalls.map(call => `- ${call.method} ${call.url}`).join('\n')}
Пример:
\`\`\`typescript
import { rest } from 'msw';
const server = setupServer(
    rest.get('${networkCalls[0]?.url || '/api/**'}', (req, res, ctx) => {
        return res(ctx.json({ data: 'mock' }));
    })
);
\`\`\`
`;
        }

        // Секция контекстов
        let contextSection = '';
        if (contextUsages.length > 0) {
            contextSection = `
## КОНТЕКСТЫ:
Компонент использует контексты: ${contextUsages.join(', ')}.
В тестах необходимо обернуть компонент в соответствующих провайдеров.
Пример:
\`\`\`typescript
import { ${contextUsages[0]}Provider } from 'path/to/provider';
render(
    <${contextUsages[0]}Provider value={mockValue}>
        <${componentName} />
    </${contextUsages[0]}Provider>
);
\`\`\`
`;
        }

        // Секция Redux
        let reduxSection = '';
        if (reduxSlices.length > 0) {
            reduxSection = `
## REDUX:
Используются слайсы: ${reduxSlices.join(', ')}.
В тестах используй redux-mock-store или configureStore.
Пример:
\`\`\`typescript
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);
const store = mockStore({ ...initialState });
render(
    <Provider store={store}>
        <${componentName} />
    </Provider>
);
\`\`\`
`;
        }

        // Дочерние компоненты
        let subSection = '';
        if (subComponents.length > 0) {
            subSection = `
## ДОЧЕРНИЕ КОМПОНЕНТЫ:
Присутствуют: ${subComponents.join(', ')}. 
Проверь, что они получают правильные пропсы и корректно рендерятся.
`;
        }

        return `Ты эксперт по интеграционному тестированию React компонентов.

## КОМПОНЕНТ: ${componentName}
${componentCode}

## АНАЛИЗ:
- Пропсы: ${props.map(p => `${p.name}: ${p.type}`).join(', ')}
- Состояния: ${states.map(s => s.name).join(', ')}
- Эффекты: ${effects.length}
- События: ${events.map(e => e.name).join(', ')}
- Зависимости: ${dependencies.join(', ')}

${apiMocksSection}
${contextSection}
${reduxSection}
${subSection}

## ТРЕБОВАНИЯ К ИНТЕГРАЦИОННЫМ ТЕСТАМ:

### Структура:
1. Настройка MSW сервера (если есть API)
2. Настройка провайдеров контекста/Redux (если есть)
3. Тесты API вызовов (загрузка, ошибки, успех)
4. Тесты взаимодействия с контекстом/Redux
5. Тесты асинхронных операций

### Правила:
- Используй MSW для мока API
- Тестируй полные flow (от события до обновления UI)
- Проверяй состояния загрузки и ошибок
- Используй waitFor для асинхронных проверок

### Формат:
\`\`\`typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const server = setupServer(
    // моки
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('${componentName} Integration', () => {
    it('should fetch and display data', async () => {
        // тест
    });
});
\`\`\`

Верни ТОЛЬКО код интеграционных тестов. Учти все указанные зависимости и провайдеры.`;
    }

    protected getMocks(analysis: ComponentAnalysis): string[] {
        const mocks: string[] = [];
        const hasApi = analysis.networkCalls && analysis.networkCalls.length > 0;
        const hasRedux = analysis.reduxSlices && analysis.reduxSlices.length > 0;

        if (hasApi) {
            mocks.push('msw');
        }
        if (hasRedux) {
            mocks.push('redux-mock-store');
        }
        if (analysis.contextUsages && analysis.contextUsages.length > 0) {
            // контексты обычно уже есть в проекте, просто добавим комментарий
            mocks.push('React Context Providers (настроить в тестах)');
        }
        return mocks;
    }

    protected getSetupFiles(componentName: string): string[] {
        return [this.generateSetupFile(componentName)];
    }

    private generateSetupFile(componentName: string): string {
        return `// Setup for ${componentName} integration tests
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
    // Базовые моки (можно переопределить в тестах)
    rest.get('*', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: 'mock' }));
    })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Утилита для ожидания загрузки
export const waitForLoading = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
};
`;
    }
}