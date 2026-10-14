import { Planner, TestPlan, ComponentAnalysis, LLMProvider } from '../types/agent';
import { BasePlanner } from '../core/base-interfaces';
export declare class TestPlanner extends BasePlanner implements Planner {
    private llm;
    constructor(llm: LLMProvider);
    plan(componentCode: string, analysis: ComponentAnalysis): Promise<TestPlan>;
}
