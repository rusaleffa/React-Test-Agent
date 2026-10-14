/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для CustomToaster
 * 
 * @file CustomToaster.integration.test.tsx
 * @description Тестирование CustomToaster 
 * @generated 2026-09-08T13:19:19.700Z
 * @type {integration}
 * @testCount 3
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, msw
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D msw

Ниже приведён пример кода интеграционного теста для компонента `CustomToaster` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomToaster } from './CustomToaster'; // импортируйте компонент здесь
import { UserContext } from '../contexts/UserContext'; // импортируйте UserContext если необходимо
import { ThemeProvider } from '@emotion/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

// создайте сервер моков
const server = setupServer(
  // добавьте моки API здесь
  rest.get('/api/some-endpoint', (req, res, ctx) =>
    res(ctx.json({ someData: 'test' })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CustomToaster Integration Tests', () => {
  it('should show a toaster with correct content when fetching data', async () => {
    render(
      <Router history={createMemoryHistory()}>
        <UserContext.Provider value={{ settings: { reduceMotion: false } }}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      </Router>,
    );

    await waitFor(() => expect(screen.queryByText(/someData/i)).toBeInTheDocument());

    // проверьте отображение сообщения в тостере
    expect(screen.getByText(/someData/i)).toBeInTheDocument();
  });

  it('should handle reduced motion setting correctly', async () => {
    render(
      <Router history={createMemoryHistory()}>
        <UserContext.Provider value={{ settings: { reduceMotion: true } }}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      </Router>,
    );

    await waitFor(() => expect(screen.queryByText(/someData/i)).toBeInTheDocument());

    // убедитесь, что анимация отсутствует при включенной опции "reduceMotion"
    expect(screen.queryByRole('alert')).not.toHaveClass('animated');
  });

  it('should handle errors properly', async () => {
    server.use(
      rest.get('/api/error-endpoint', (req, res, ctx) =>
        res(ctx.status(400), ctx.json({ message: 'error occurred' })),
      ),
    );

    render(
      <Router history={createMemoryHistory()}>
        <UserContext.Provider value={{ settings: { reduceMotion: false } }}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      </Router>,
    );

    await waitFor(() => expect(screen.queryByText(/error occurred/i)).toBeInTheDocument());

    // проверьте сообщение об ошибке
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});
### Примечания к тестам:
- **Настройка MSW**: Создаётся сервер моков для имитации сетевых запросов.
- **Тестирование API вызовов**: Добавьте дополнительные моки для проверки различных сценариев работы API.
- **Проверка состояний загрузки и ошибок**: Используйте `waitFor` для ожидания появления сообщений или ошибок в тостере.
- **Асинхронные операции**: Убедитесь, что тесты корректно обрабатывают асинхронность и проверяют состояние UI после завершения операций.

Этот шаблон можно адаптировать под конкретные требования вашего приложения и добавить необходимые проверки и сценарии тестирования.