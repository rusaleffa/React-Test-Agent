import { exec } from 'child_process';
import { promisify } from 'util';
import { AgentContext, ExecutionResult, TestPlan, Executor } from '../types/agent';

const execAsync = promisify(exec);

// Запускает тесты проекта через встроенный jest/vitest.
// Не привязан к конкретному файлу — полагается на конфигурацию проекта.
export class TestExecutor implements Executor {
    private readonly DEFAULT_TIMEOUT_MS = 120_000;

    async execute(plan: TestPlan, context: AgentContext): Promise<ExecutionResult> {
        const startTime = Date.now();
        const framework = context.config.testFramework;
        const command = framework === 'vitest'
            ? 'npx vitest run --reporter=json'
            : 'npx jest --ci --json';

        try {
            const { stdout, stderr } = await execAsync(command, {
                cwd: process.cwd(),
                timeout: this.DEFAULT_TIMEOUT_MS,
                maxBuffer: 10 * 1024 * 1024,
            });

            return {
                success: true,
                output: { stdout, stderr, plan },
                duration: Date.now() - startTime,
            };
        } catch (error) {
            const err = error as { stdout?: string; stderr?: string; message?: string };
            return {
                success: false,
                error: err.message || 'Тесты не прошли',
                output: { stdout: err.stdout, stderr: err.stderr, plan },
                duration: Date.now() - startTime,
            };
        }
    }
}