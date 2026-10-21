import { BaseTestGenerator } from './base/BaseTestGenerator';
import { TestGenerationInput, TestType } from '../types';
import { ComponentAnalysis } from '../../../types/agent';

export class PerformanceTestGenerator extends BaseTestGenerator {
    readonly name = 'PerformanceTestGenerator';
    readonly type = TestType.PERFORMANCE;
    readonly description = 'Тесты производительности';

    isApplicable(analysis: ComponentAnalysis): boolean {
        return analysis.props.length > 5
            || analysis.states.length > 3
            || analysis.effects.length > 3;
    }

    protected buildPrompt(input: TestGenerationInput): string {
        const { componentName, componentCode, analysis } = input;
        const requiredProps = analysis.props.filter(p => p.required);
        const propsHint = requiredProps.length > 0
            ? `\n⚠️ Обязательные пропсы (передавай ВСЕГДА): ${requiredProps.map(p => `${p.name}: ${p.type}`).join(', ')}\n`
            : '';

        return `Ты эксперт по тестированию производительности React.

## КОМПОНЕНТ: ${componentName}
${componentCode}

## АНАЛИЗ:
- Размер: ${this.estimateComponentSize(componentCode)}
- Пропсов: ${analysis.props.length}
- Состояний: ${analysis.states.length}
- Эффектов: ${analysis.effects.length}
${propsHint}
## ТРЕБОВАНИЯ:
1. Измеряй время рендеринга через \`performance.now()\`.
2. Проверяй, что повторный рендер с теми же пропсами не происходит (memo).
3. Проверяй очистку эффектов через mock cleanup.
4. Передавай обязательные пропсы.
5. Не используй несуществующие роли/селекторы.

## ФОРМАТ ВЫВОДА:
Только TypeScript-код без markdown-обёртки и пояснений. Первая строка — \`import ...\`.`;
    }

    private estimateComponentSize(code: string): string {
        const lines = code.split('\n').length;
        if (lines < 50) return 'маленький';
        if (lines < 150) return 'средний';
        return 'большой';
    }
}