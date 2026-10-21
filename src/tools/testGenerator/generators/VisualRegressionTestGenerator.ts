import { BaseTestGenerator } from './base/BaseTestGenerator';
import { TestGenerationInput, TestType } from '../types';
import { ComponentAnalysis } from '../../../types/agent';

export class VisualRegressionTestGenerator extends BaseTestGenerator {
    readonly name = 'VisualRegressionTestGenerator';
    readonly type = TestType.VISUAL;
    readonly description = 'Визуальные регрессионные тесты';

    isApplicable(analysis: ComponentAnalysis): boolean {
        return analysis.props.length > 0 || analysis.events.length > 0;
    }

    protected buildPrompt(input: TestGenerationInput): string {
        const { componentName, componentCode, analysis } = input;
        const requiredProps = analysis.props.filter(p => p.required);
        const propsHint = requiredProps.length > 0
            ? `\n⚠️ Обязательные пропсы: ${requiredProps.map(p => `${p.name}: ${p.type}`).join(', ')}\n`
            : '';

        return `Ты эксперт по визуальному регрессионному тестированию React.

## КОМПОНЕНТ: ${componentName}
${componentCode}

## АНАЛИЗ:
- Пропсы: ${analysis.props.map(p => `${p.name}: ${p.type}`).join(', ') || 'нет'}
- События: ${analysis.events.map(e => e.name).join(', ') || 'нет'}
- Состояния: ${analysis.states.map(s => s.name).join(', ') || 'нет'}
${propsHint}
## ТРЕБОВАНИЯ:
1. Используй \`jest-image-snapshot\` (\`toMatchImageSnapshot\`).
2. Покрой: светлая/тёмная тема, все состояния (loading/error/success), hover/focus.
3. Передавай обязательные пропсы.
4. Не выдумывай селекторы.

## ФОРМАТ ВЫВОДА:
Только TypeScript-код без markdown-обёртки и пояснений. Первая строка — \`import ...\`.`;
    }

    protected getSetupFiles(_componentName: string): string[] {
        return [this.generateSetupFile()];
    }

    private generateSetupFile(): string {
        return `// Глобальный setup для визуальных регрессионных тестов
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

export const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 }
};
`;
    }
}