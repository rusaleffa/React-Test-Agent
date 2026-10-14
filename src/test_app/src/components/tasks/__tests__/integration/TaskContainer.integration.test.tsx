/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для TaskContainer
 * 
 * @file TaskContainer.integration.test.tsx
 * @description Тестирование TaskContainer 
 * @generated 2026-09-08T13:28:05.945Z
 * @type {integration}
 * @testCount 5
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

Ниже представлен пример кода интеграционного тестирования компонента `TaskContainer`, который учитывает требования и структуру, описанные в задаче.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';  
import configureStore from '../../store/configureStore';  
import TaskContainer from './TaskContainer';

// Имитация данных из API
const mockData = [
  {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task.',
    dueDate: '2023-10-10',
    categories: ['Work'],
    status: 'active'
  },
];

// Моки серверного API
const server = setupServer(
  rest.get('/tasks', (req, res, ctx) => {
    return res(ctx.json(mockData));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создаем хранилище Redux
const store = configureStore();

describe('TaskContainer Integration Tests', () => {
  it('renders correctly with mocked data', async () => {
    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText(/test task/i)).toBeInTheDocument());
    expect(screen.getByText(/this is a test task./i)).toBeInTheDocument();
    expect(screen.getByText(/work/i)).toBeInTheDocument(); // Проверка категории
  });

  it('handles loading state', async () => {
    server.use(
      rest.get('/tasks', (req, res, ctx) => {
        return res(ctx.delay(1000), ctx.json([])); // Задержка перед ответом
      })
    );

    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/loading/i)).toBeInTheDocument()); // Проверяем состояние загрузки
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()); // Проверяем завершение загрузки
  });

  it('displays error message', async () => {
    server.use(
      rest.get('/tasks', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
      })
    );

    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText(/internal server error/i)).toBeInTheDocument());
  });

  it('interacts with search input', async () => {
    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    const searchInput = screen.getByRole('textbox');
    userEvent.type(searchInput, 'test task');
    await waitFor(() => expect(screen.getByText(/test task/i)).toBeInTheDocument());
  });

  it('interacts with checkbox', async () => {
    render(
      <Provider store={store}>
        <TaskContainer />
      </Provider>
    );

    const checkBox = screen.getByRole('checkbox');
    userEvent.click(checkBox);
    await waitFor(() => expect(checkBox).toHaveAttribute('aria-checked', 'true'));
  });
});
Этот набор тестов проверяет следующие аспекты:

- Правильное отображение данных после успешной загрузки.
- Отображение сообщения об ошибке при возникновении проблемы на стороне сервера.
- Корректное взаимодействие с поисковым полем.
- Реакцию чекбокса на пользовательские действия.

Обратите внимание, что тесты используют библиотеку `@testing-library/react` для проверки DOM-элементов и библиотеки `msw` для имитации сетевых запросов и ответов.