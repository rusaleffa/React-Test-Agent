// src/tools/generators/PerformanceTestGenerator.ts
import { BaseTestGenerator } from "tools/testGenerator/generators/base/BaseTestGenerator";
import { TestGenerationInput, TestType } from "tools/testGenerator/types";
import { ComponentAnalysis } from "types/agent";

export class PerformanceTestGenerator extends BaseTestGenerator {
    readonly name = 'PerformanceTestGenerator';
    readonly type = TestType.PERFORMANCE;
    readonly description = 'Тесты производительности';

    isApplicable(analysis: ComponentAnalysis): boolean {
        return analysis.props.length > 5 || analysis.states.length > 3 || analysis.effects.length > 3;
    }

    protected buildPrompt(input: TestGenerationInput): string {
        const { componentName, componentCode, analysis } = input;

        return `Ты эксперт по тестированию производительности React компонентов.

## КОМПОНЕНТ: ${componentName}
${componentCode}

## АНАЛИЗ:
- Размер: ${this.estimateComponentSize(componentCode)}
- Пропсов: ${analysis.props.length}
- Состояний: ${analysis.states.length}
- Эффектов: ${analysis.effects.length}

## ФОРМАТ ТЕСТОВ:
\`\`\`typescript
import { performance } from 'perf_hooks';

test('should render within performance budget', () => {
    const start = performance.now();
    render(<${componentName} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
});
\`\`\`

## ТРЕБОВАНИЯ К ТЕСТАМ ПРОИЗВОДИТЕЛЬНОСТИ:
1. Измеряй время рендеринга
2. Проверяй количество ререндеров
3. Тестируй с большими данными
4. Проверяй мемоизацию
5. Тестируй очистку эффектов

Верни ТОЛЬКО код тестов производительности.`;
    }

    private estimateComponentSize(code: string): string {
        const lines = code.split('\n').length;
        if (lines < 50) return 'маленький';
        if (lines < 150) return 'средний';
        return 'большой';
    }
}