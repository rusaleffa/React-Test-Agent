// src/tools/generators/SnapshotTestGenerator.ts
import { BaseTestGenerator } from "tools/testGenerator/generators/base/BaseTestGenerator";

import { TestGenerationInput, TestType } from "tools/testGenerator/types";
import { ComponentAnalysis } from "types/agent";

export class SnapshotTestGenerator extends BaseTestGenerator {
    readonly name = 'SnapshotTestGenerator';
    readonly type = TestType.SNAPSHOT;
    readonly description = 'Snapshot-тесты для проверки рендеринга';

    isApplicable(analysis: ComponentAnalysis): boolean {
        return analysis.componentType !== 'static';
    }

    protected buildPrompt(input: TestGenerationInput): string {
        const { componentName, componentCode, analysis } = input;

        return `Ты эксперт по snapshot-тестированию React компонентов.

## КОМПОНЕНТ: ${componentName}
${componentCode}

## АНАЛИЗ:
- Пропсы: ${analysis.props.map(p => `${p.name}: ${p.type}`).join(', ')}
- Состояния: ${analysis.states.map(s => s.name).join(', ')}
- Тип: ${analysis.componentType}

## ФОРМАТ ТЕСТОВ:
\`\`\`typescript
import renderer from 'react-test-renderer';

describe('${componentName} Snapshot Tests', () => {
    test('should match snapshot with default props', () => {
        const tree = renderer.create(<${componentName} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
\`\`\`

## ТРЕБОВАНИЯ К SNAPSHOT ТЕСТАМ:
1. Создай снапшоты для всех комбинаций пропсов
2. Тестируй все состояния (загрузка, ошибка, данные)
3. Используй toMatchSnapshot()
4. Группируй снапшоты по сценариям
5. Обновляй снапшоты при осознанных изменениях

Верни ТОЛЬКО код snapshot тестов.`;
    }
}