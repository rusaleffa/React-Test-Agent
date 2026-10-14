// src/tools/testGenerator/generators/UnitTestGenerator.ts
import { BaseTestGenerator } from './base/BaseTestGenerator';
import { TestGenerationInput, TestType } from '../types';
import { ComponentAnalysis } from '../../../types/agent';

export class UnitTestGenerator extends BaseTestGenerator {
    readonly name = 'UnitTestGenerator';
    readonly type = TestType.UNIT;
    readonly description = 'Модульные тесты для изолированной проверки компонента';

    isApplicable(analysis: ComponentAnalysis): boolean {
        return true; // всегда применяется
    }

    protected buildPrompt(input: TestGenerationInput): string {
        const { componentName, componentCode, componentPath, analysis } = input;
        const {
            props = [],
            states = [],
            events = [],
            effects = [],
            dependencies = [],
            subComponents = [],
            networkCalls = [],
            contextUsages = []
        } = analysis;

        // Секция с дочерними компонентами – проверка пропсов
        let subComponentsSection = '';
        if (subComponents.length > 0) {
            subComponentsSection = `
## ДОЧЕРНИЕ КОМПОНЕНТЫ:
Компонент рендерит: ${subComponents.join(', ')}.
В тестах проверь, что они получают корректные пропсы (можно использовать screen.getByTestId или моки).
`;
        }

        // Секция с API-вызовами – они должны быть замоканы
        let apiSection = '';
        if (networkCalls.length > 0) {
            apiSection = `
## API ВЫЗОВЫ:
Обнаружены вызовы: ${networkCalls.map(c => `${c.method} ${c.url}`).join(', ')}.
В юнит-тестах эти вызовы должны быть замоканы (jest.mock или jest.spyOn).
`;
        }

        // Контексты – должны быть замоканы
        let contextSection = '';
        if (contextUsages.length > 0) {
            contextSection = `
## КОНТЕКСТЫ:
Используются контексты: ${contextUsages.join(', ')}.
В тестах необходимо передать мок-значения через провайдеры.
`;
        }

        return `Ты эксперт по модульному тестированию React компонентов.

## ВХОДНЫЕ ДАННЫЕ:
- Компонент: ${componentName}
- Путь: ${componentPath}
- Тип: ${analysis.componentType}
- Сложность: ${analysis.complexity}

## КОД КОМПОНЕНТА:
${componentCode}

## АНАЛИЗ КОМПОНЕНТА:
Пропсы: ${props.map(p => `${p.name}: ${p.type}`).join(', ')}
Состояния: ${states.map(s => s.name).join(', ')}
События: ${events.map(e => e.name).join(', ')}
Эффекты: ${effects.length} шт.
Зависимости: ${dependencies.join(', ')}

${subComponentsSection}
${apiSection}
${contextSection}

## ТРЕБОВАНИЯ К МОДУЛЬНЫМ ТЕСТАМ:

### Структура:
1. Импорты (React, testing-library, компонент)
2. describe блоки по функциональности
3. Изолированные тесты

### Что тестировать:
1. Рендеринг с различными пропсами (включая краевые случаи)
2. Обновление состояний
3. Обработчики событий (onClick, onChange и т.д.)
4. Вспомогательные функции (если есть)
5. **Взаимодействие с дочерними компонентами** (проверка пропсов)
6. **Моки внешних API** (если есть)

### Правила:
- Используй userEvent для взаимодействий
- Не используй реальные API – мокай их
- Тесты должны быть независимыми
- Используй screen.getByRole, getByText и т.д.

### Формат:
\`\`\`typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ${componentName} from '../${componentName}';

// Моки для дочерних компонентов (если нужно)
${subComponents.length > 0 ? subComponents.map(name => `jest.mock('../${name}', () => () => <div data-testid="mock-${name}" />);`).join('\n') : ''}

describe('${componentName}', () => {
    describe('Рендеринг', () => {
        it('should render with default props', () => {
            render(<${componentName} />);
            // проверки
        });
        // ... другие тесты
    });
});
\`\`\`

Верни ТОЛЬКО код тестов без markdown-оберток. Учти все особенности компонента (дочерние, API, контексты).`;
    }

    protected getSetupFiles(componentName: string): string[] {
        return [this.generateSetupFile(componentName)];
    }

    private generateSetupFile(componentName: string): string {
        return `// Setup file for ${componentName} unit tests
import '@testing-library/jest-dom';

// Глобальные моки (например, для matchMedia)
global.matchMedia = global.matchMedia || function() {
    return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
};

// Здесь можно добавить моки для внешних зависимостей
// jest.mock('some-module', () => ({ ... }));
`;
    }
}