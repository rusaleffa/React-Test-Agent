// src/tools/generators/VisualRegressionTestGenerator.ts
import {BaseTestGenerator} from "tools/testGenerator/generators/base/BaseTestGenerator.ts";
import { TestGenerationInput, TestType } from "tools/testGenerator/types";
import { ComponentAnalysis } from "types/agent";

export class VisualRegressionTestGenerator extends BaseTestGenerator {
    readonly name = 'VisualRegressionTestGenerator';
    readonly type = TestType.VISUAL;
    readonly description = 'Визуальные регрессионные тесты';

    isApplicable(analysis: ComponentAnalysis): boolean {
        return analysis.props.length > 0 || analysis.events.length > 0;
    }

    protected buildPrompt(input: TestGenerationInput): string {
        const { componentName, componentCode, analysis } = input;

        return `Ты эксперт по визуальному регрессионному тестированию React компонентов.

## КОМПОНЕНТ: ${componentName}
${componentCode}

## АНАЛИЗ:
- Пропсы: ${analysis.props.map(p => `${p.name}: ${p.type}`).join(', ')}
- События: ${analysis.events.map(e => e.name).join(', ')}
- Состояния: ${analysis.states.map(s => s.name).join(', ')}

## ФОРМАТ ТЕСТОВ:
\`\`\`typescript
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe('${componentName} Visual Tests', () => {
    test('should render correctly visually', async () => {
        const { container } = render(<${componentName} />);
        expect(container).toMatchImageSnapshot();
    });
});
\`\`\`

## ТРЕБОВАНИЯ К ВИЗУАЛЬНЫМ ТЕСТАМ:
1. Тестируй на всех разрешениях экрана
2. Проверяй все состояния (loading, error, success)
3. Тестируй hover, focus, active состояния
4. Используй snapshot-сравнение изображений
5. Тестируй темную и светлую тему

Верни ТОЛЬКО код визуальных тестов.`;
    }

    protected getSetupFiles(componentName: string): string[] {
        return [this.generateSetupFile(componentName)];
    }

    private generateSetupFile(componentName: string): string {
        return `// Setup for ${componentName} visual tests
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

// Настройка для разных разрешений
const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 }
};

export const setViewport = (viewport: keyof typeof viewports) => {
    global.innerWidth = viewports[viewport].width;
    global.innerHeight = viewports[viewport].height;
};
`;
    }
}