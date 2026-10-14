// Setup for ReadAloudTab integration tests
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
    // Базовые моки (можно переопределить в тестах)
    rest.get('*', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: 'mock' }));
    })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Утилита для ожидания загрузки
export const waitForLoading = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
};
