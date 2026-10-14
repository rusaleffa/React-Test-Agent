/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для TabGroupProvider
 * 
 * @file TabGroupProvider.integration.test.tsx
 * @description Тестирование TabGroupProvider 
 * @generated 2026-09-07T22:48:00.416Z
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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabGroupProvider } from './TabGroupProvider'; // импортируйте компонент здесь

// создаем сервер моков
const server = setupServer(
  // добавляем моки для имитации API запросов
  rest.get('/api/tabs', (req, res, ctx) =>
    res(ctx.json([
      { id: 1, title: 'Tab 1' },
      { id: 2, title: 'Tab 2' },
      { id: 3, title: 'Tab 3' },
    ]))
  ),
);

beforeAll(() => server.listen()); // запускаем сервер перед каждым тестом
afterEach(() => server.resetHandlers()); // сбрасываем моки после каждого теста
afterAll(() => server.close()); // закрываем сервер после всех тестов

describe('TabGroupProvider Integration Tests', () => {
  it('should render tabs correctly when fetched successfully', async () => {
    render(
      <TabGroupProvider name="test-group">
        <div>
          <TabPanel index={0}>
            <h1>Content of tab 1</h1>
          </TabPanel>
          <TabPanel index={1}>
            <h1>Content of tab 2</h1>
          </TabPanel>
          <TabPanel index={2}>
            <h1>Content of tab 3</h1>
          </TabPanel>
        </div>
      </TabGroupProvider>,
    );

    await waitFor(() => expect(screen.queryByText(/content of tab 1/i)).toBeInTheDocument());

    // проверяем отображение заголовков табов
    expect(screen.getByText('Content of tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content of tab 2')).not.toBeInTheDocument(); // не должен быть виден
    expect(screen.getByText('Content of tab 3')).not.toBeInTheDocument(); // не должен быть виден

    // переключаемся на второй таб
    userEvent.click(screen.getByRole('tab', { name: /tab 2/i }));

    await waitFor(() => expect(screen.queryByText(/content of tab 2/i)).toBeInTheDocument());

    // проверяем отображение второго таба
    expect(screen.getByText('Content of tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content of tab 1')).not.toBeInTheDocument(); // не должен быть виден
    expect(screen.getByText('Content of tab 3')).not.toBeInTheDocument(); // не должен быть виден

    // переключаемся на третий таб
    userEvent.click(screen.getByRole('tab', { name: /tab 3/i }));

    await waitFor(() => expect(screen.queryByText(/content of tab 3/i)).toBeInTheDocument());

    // проверяем отображение третьего таба
    expect(screen.getByText('Content of tab 3')).toBeInTheDocument();
    expect(screen.getByText('Content of tab 1')).not.toBeInTheDocument(); // не должен быть виден
    expect(screen.getByText('Content of tab 2')).not.toBeInTheDocument(); // не должен быть виден
  });

  it('should handle loading state properly', async () => {
    render(<TabGroupProvider name="test-group"><div><TabPanel index={0} /></div></TabGroupProvider>);

    // ожидаем появления индикатора загрузки
    await waitFor(() => expect(screen.queryByRole('status', { name: /loading/i }).toBeInTheDocument()));

    // имитируем успешный запрос данных
    server.use(
      rest.get('/api/tabs', (req, res, ctx) =>
        res(ctx.delay(100), ctx.json([{ id: 1, title: 'Tab 1' }])),
      ),
    );

    // ждем завершения запроса и проверки контента
    await waitFor(() => expect(screen.queryByText(/tab 1/i).toBeInTheDocument()));
  });

  it('should handle error state properly', async () => {
    render(<TabGroupProvider name="test-group"><div><TabPanel index={0} /></div></TabGroupProvider>);

    // имитируем ошибку при запросе данных
    server.use(rest.get('/api/tabs', (req, res, ctx) => res(ctx.status(500)));

    // ожидаем появления сообщения об ошибке
    await waitFor(() => expect(screen.queryByText(/error occurred/i).toBeInTheDocument()));
  });
});