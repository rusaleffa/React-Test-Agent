import { BaseTestGenerator } from './base/BaseTestGenerator';
import { TestGenerationInput, TestType } from '../types';
import { ComponentAnalysis } from '../../../types/agent';

export class UnitTestGenerator extends BaseTestGenerator {
    readonly name = 'UnitTestGenerator';
    readonly type = TestType.UNIT;
    readonly description = 'Модульные тесты для изолированной проверки компонента';

    // Юнит-тесты применимы всегда
    isApplicable(_analysis: ComponentAnalysis): boolean {
        return true;
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

        // Секция с обязательными пропсами — без них тест не скомпилируется
        const requiredProps = props.filter(p => p.required);
        const requiredPropsHint = requiredProps.length > 0
            ? `\n⚠️ Обязательные пропсы (передавай ВСЕГДА, иначе тест не скомпилируется): ${requiredProps.map(p => `${p.name}: ${p.type}`).join(', ')}\n`
            : '';

        let subComponentsSection = '';
        if (subComponents.length > 0) {
            subComponentsSection = `
## ДОЧЕРНИЕ КОМПОНЕНТЫ:
Компонент рендерит: ${subComponents.join(', ')}.
Проверь, что они получают корректные пропсы (можно использовать screen.getByTestId или замокать их).
`;
        }

        let apiSection = '';
        if (networkCalls.length > 0) {
            apiSection = `
## API-ВЫЗОВЫ:
Обнаружены вызовы: ${networkCalls.map(c => `${c.method} ${c.url}`).join(', ')}.
В юнит-тестах эти вызовы должны быть замоканы через jest.mock / jest.spyOn.
`;
        }

        let contextSection = '';
        if (contextUsages.length > 0) {
            contextSection = `
## КОНТЕКСТЫ:
Используются контексты: ${contextUsages.join(', ')}.
В тестах передавай мок-значения через соответствующие провайдеры.
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
Пропсы: ${props.map(p => `${p.name}: ${p.type}${p.required ? ' (required)' : ''}`).join(', ') || 'нет'}
Состояния: ${states.map(s => s.name).join(', ') || 'нет'}
События: ${events.map(e => e.name).join(', ') || 'нет'}
Эффекты: ${effects.length} шт.
Зависимости: ${dependencies.join(', ') || 'нет'}
${requiredPropsHint}
${subComponentsSection}
${apiSection}
${contextSection}

## ЧТО ТЕСТИРОВАТЬ:
1. Рендеринг с разными пропсами (включая граничные случаи)
2. Обновление состояний
3. Обработчики событий (onClick, onChange и т.д.)
4. Взаимодействие с дочерними компонентами (если есть)
5. Моки внешних API (если есть)

## ПРАВИЛА:
- Используй userEvent для взаимодействий
- Не используй реальные API — мокай их
- Тесты должны быть независимыми
- Используй screen.getByRole / getByText
- Передавай ВСЕ обязательные пропсы
- Не используй несуществующие data-testid — бери из кода компонента

## ФОРМАТ ВЫВОДА:
Верни ТОЛЬКО код на TypeScript без markdown-обёртки и без пояснений. Первая строка — \`import ...\`.`;
    }

    protected getSetupFiles(_componentName: string): string[] {
        return [this.generateSetupFile()];
    }

    private generateSetupFile(): string {
        return `// Глобальный setup для юнит-тестов
import '@testing-library/jest-dom';

// Заглушка для matchMedia (используется MUI и другими библиотеками)
global.matchMedia = global.matchMedia || function () {
    return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
    };
};
`;
    }
}