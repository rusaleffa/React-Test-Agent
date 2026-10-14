import { AgentContext, ExecutionResult, TestPlan, Executor } from '../types/agent';
export declare class TestExecutor implements Executor {
    execute(plan: TestPlan, context: AgentContext): Promise<ExecutionResult>;
}
