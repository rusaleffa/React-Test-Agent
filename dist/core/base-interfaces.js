// Базовые реализации
export class BaseTool {
    validateInput(input, schema) {
        return true;
    }
}
export class BasePlanner {
    calculateComplexity(analysis) {
        const factors = [];
        if (analysis.props?.length > 5)
            factors.push('many_props');
        if (analysis.states?.length > 3)
            factors.push('many_states');
        if (analysis.effects?.length > 2)
            factors.push('many_effects');
        if (analysis.dependencies?.length > 5)
            factors.push('many_dependencies');
        if (factors.length >= 3)
            return 'high';
        if (factors.length >= 1)
            return 'medium';
        return 'low';
    }
}
//# sourceMappingURL=base-interfaces.js.map