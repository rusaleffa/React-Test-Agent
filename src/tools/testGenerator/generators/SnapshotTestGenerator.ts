import { BaseTestGenerator } from './base/BaseTestGenerator';
import { TestGenerationInput, TestType } from '../types';
import { ComponentAnalysis } from '../../../types/agent';

export class SnapshotTestGenerator extends BaseTestGenerator {
    readonly name = 'SnapshotTestGenerator';
    readonly type = TestType.SNAPSHOT;
    readonly description = 'Snapshot-тесты для проверки рендеринга';

    isApplicable(analysis: ComponentAnalysis): boolean {
        return analysis.componentType !== 'static';
    }

    protected buildPrompt(input: TestGenerationInput): string {
        const { componentName, componentCode, analysis } = input;
        const requiredProps = analysis.props.filter(p => p.required);
        const propsHint = requiredProps.length > 0
            ? `\n⚠️ Обязательные пропсы (передавай в каждом \`renderer.create\`): ${requiredProps.map(p => `${p.name}: ${p.type}`).join(', ')}\n`
            : '';

        return `Ты эксперт по snapshot-тестированию React.

## КОМПОНЕНТ: ${componentName}
${componentCode}

## АНАЛИЗ:
- Пропсы: ${analysis.props.map(p => `${p.name}: ${p.type}${p.required ? ' (required)' : ''}`).join(', ') || 'нет'}
- Состояния: ${analysis.states.map(s => s.name).join(', ') || 'нет'}
- Тип: ${analysis.componentType}
${propsHint}
## ТРЕБОВАНИЯ:
1. Используй \`react-test-renderer\` — \`renderer.create(...).toJSON()\`.
2. Передавай ВСЕ обязательные пропсы в каждом \`renderer.create\`.
3. Покрой: состояние по умолчанию, каждое значимое состояние, граничные значения.
4. Не выдумывай пропсы, которых нет в типе компонента.

## ФОРМАТ ВЫВОДА:
Только TypeScript-код без markdown-обёртки и пояснений. Первая строка — \`import ...\`.`;
    }
}