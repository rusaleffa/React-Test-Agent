// src/tools/testGenerator/generators/E2ETestGenerator.ts
import { BaseTestGenerator } from './base/BaseTestGenerator';
import { TestGenerationInput, TestType } from '../types';
import { ComponentAnalysis } from '../../../types/agent';

export class E2ETestGenerator extends BaseTestGenerator {
    readonly name = 'E2ETestGenerator';
    readonly type = TestType.E2E;
    readonly description = 'Сквозные тесты для полного пользовательского пути';

    isApplicable(analysis: ComponentAnalysis): boolean {
        const events = analysis.events?.length || 0;
        const networkCalls = analysis.networkCalls?.length || 0;
        const subComponents = analysis.subComponents?.length || 0;
        // E2E имеет смысл, если есть события, сетевые вызовы или вложенные компоненты
        return events > 2 || networkCalls > 0 || subComponents > 1;
    }

    protected buildPrompt(input: TestGenerationInput): string {
        const { componentName, componentCode, analysis } = input;
        const {
            props = [],
            states = [],
            events = [],
            dependencies = [],
            networkCalls = [],
            subComponents = [],
            contextUsages = [],
            reduxSlices = []
        } = analysis;

        // Генерируем секцию с API-моками
        let apiMocksSection = '';
        if (networkCalls.length > 0) {
            apiMocksSection = `
## API МОКИ (Playwright):
Для следующих запросов создай моки с использованием Playwright:
${networkCalls.map((call, idx) => `${idx + 1}. ${call.method} ${call.url}`).join('\n')}
Пример мока:
\`\`\`typescript
await page.route('${networkCalls[0]?.url || '/api/**'}', (route) => {
    route.fulfill({
        status: 200,
        body: JSON.stringify({ data: 'mock' }),
    });
});
\`\`\`
`;
        }

        // Секция с дочерними компонентами
        let subComponentsSection = '';
        if (subComponents.length > 0) {
            subComponentsSection = `
## ДОЧЕРНИЕ КОМПОНЕНТЫ:
В компоненте используются следующие дочерние компоненты:
${subComponents.map(name => `- ${name}`).join('\n')}
Протестируй их взаимодействие и передачу пропсов.
`;
        }

        // Секция с контекстами и Redux
        let contextSection = '';
        if (contextUsages.length > 0 || reduxSlices.length > 0) {
            contextSection = `
## КОНТЕКСТЫ И REDUX:
${contextUsages.length > 0 ? `Используемые контексты: ${contextUsages.join(', ')}` : ''}
${reduxSlices.length > 0 ? `Используемые Redux слайсы: ${reduxSlices.join(', ')}` : ''}
При необходимости настрой провайдеры в тестах.
`;
        }

        return `Ты эксперт по сквозному тестированию React приложений с Playwright.

## КОМПОНЕНТ: ${componentName}
${componentCode}

## АНАЛИЗ:
- Пропсы: ${props.map(p => `${p.name}: ${p.type}`).join(', ')}
- Состояния: ${states.map(s => s.name).join(', ')}
- События: ${events.map(e => e.name).join(', ')}
- Зависимости: ${dependencies.join(', ')}

${apiMocksSection}
${subComponentsSection}
${contextSection}

## ПОЛЬЗОВАТЕЛЬСКИЕ СЦЕНАРИИ:
${this.generateUserScenarios(analysis)}

## ТРЕБОВАНИЯ К E2E ТЕСТАМ:

### Структура:
1. Настройка Playwright с моками API (если есть)
2. Тесты пользовательских сценариев (включая взаимодействие с дочерними компонентами)
3. Тесты навигации (если есть)
4. Тесты состояния (с учётом Redux/контекста)
5. Кросс-браузерные тесты

### Правила:
- Используй data-testid для поиска элементов
- Тестируй реальные пользовательские сценарии
- Проверяй URL и навигацию (если есть роутинг)
- Используй скриншоты для проверки UI (по желанию)
- Мокай все внешние API-запросы

### Формат:
\`\`\`typescript
import { test, expect, Page } from '@playwright/test';

test.describe('${componentName} E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Моки API
        await page.route('${networkCalls[0]?.url || '/api/**'}', route => {
            route.fulfill({ status: 200, body: JSON.stringify({ data: 'mock' }) });
        });
        await page.goto('/');
    });

    test('should load and display component', async ({ page }) => {
        await expect(page.getByTestId('component')).toBeVisible();
    });
});
\`\`\`

Верни ТОЛЬКО код E2E тестов с использованием Playwright. Учти все указанные выше сценарии и моки.`;
    }

    private generateUserScenarios(analysis: ComponentAnalysis): string {
        const scenarios = [];
        const { events = [], states = [], networkCalls = [], subComponents = [] } = analysis;

        scenarios.push('1. Загрузка и отображение компонента');

        if (states.length > 0) {
            scenarios.push('2. Изменение состояния через взаимодействие (клик, ввод)');
        }

        if (events.length > 0) {
            scenarios.push('3. Обработка пользовательских событий (onClick, onChange и т.д.)');
        }

        if (networkCalls.length > 0) {
            scenarios.push('4. Взаимодействие с внешними API (запросы и ответы)');
        }

        if (subComponents.length > 0) {
            scenarios.push(`5. Взаимодействие с дочерними компонентами: ${subComponents.join(', ')}`);
        }

        if (scenarios.length === 1) {
            scenarios.push('2. Проверка базового поведения');
        }

        return scenarios.join('\n');
    }

    protected getMocks(analysis: ComponentAnalysis): string[] {
        const mocks: string[] = [];
        if (analysis.networkCalls && analysis.networkCalls.length > 0) {
            mocks.push('@playwright/test (встроенные моки)');
        }
        return mocks;
    }

    protected getSetupFiles(componentName: string): string[] {
        return [this.generatePlaywrightConfig()];
    }

    private generatePlaywrightConfig(): string {
        return `// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './',
    timeout: 30000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
        { name: 'firefox', use: { browserName: 'firefox' } },
        { name: 'webkit', use: { browserName: 'webkit' } },
    ],
};

export default config;`;
    }
}