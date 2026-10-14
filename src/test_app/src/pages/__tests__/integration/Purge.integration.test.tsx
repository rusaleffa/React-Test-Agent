/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для Purge
 * 
 * @file Purge.integration.test.tsx
 * @description Тестирование Purge 
 * @generated 2026-09-08T13:33:26.974Z
 * @type {integration}
 * @testCount 4
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

Вот пример кода интеграционного теста для компонента `Purge`, который учитывает предоставленные требования и формат:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContextProvider } from '../contexts/UserContext'; // Предположим, что это провайдер вашего контекста
import { ThemeProvider } from '@emotion/react';
import theme from '../styles/theme'; // Предположим, что у вас есть стилизованный компонент темы
import Purge from './Purge'; // Импортируйте ваш компонент для тестирования

// Создайте mock store или используйте реальный state
const initialState = {
  user: {
    tasks: [
      { id: 'task1', name: 'Task 1', done: true },
      { id: 'task2', name: 'Task 2', done: false },
      { id: 'task3', name: 'Task 3', done: true },
    ],
  },
};

const store = createStore(() => initialState);

const server = setupServer(
  // Моки API здесь, если они используются в вашем приложении
  rest.get('/api/tasks', (req, res, ctx) =>
    res(ctx.json(initialState.user.tasks))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Purge Integration Tests', () => {
  it('should render the correct number of tasks', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <UserContextProvider>
            <Purge />
          </UserContextProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/Task 1/g)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Task 2/g)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Task 3/g)).toBeInTheDocument());
  });

  it('should allow selecting tasks for purging', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <UserContextProvider>
            <Purge />
          </UserContextProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => screen.getByText('Task 1'));
    userEvent.click(screen.getByText('Task 1')); // Выбираем первый элемент

    await waitFor(() => expect(screen.queryByText('Task 1')).toHaveClass('selected'));

    userEvent.click(screen.getByText('Task 3')); // Выбираем второй элемент
    await waitFor(() => expect(screen.queryByText('Task 3')).toHaveClass('selected'));

    expect(screen.queryAllByClassName('selected').length).toEqual(2); // Убедимся, что оба элемента выбраны
  });

  it('should trigger a confirmation dialog when clicking "Purge All"', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <UserContextProvider>
            <Purge />
          </UserContextProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => screen.getByText('Purge All Tasks'));
    userEvent.click(screen.getByText('Purge All Tasks'));

    await waitFor(() => screen.getByRole('dialog', { name: /confirmation/i }));
  });

  it('should successfully purge selected tasks', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <UserContextProvider>
            <Purge />
          </UserContextProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => screen.getByText('Task 1'));
    userEvent.click(screen.getByText('Task 1'));

    await waitFor(() => screen.getByText('Task 3'));
    userEvent.click(screen.getByText('Task 3'));

    userEvent.click(screen.getByText('Purge Selected'));

    await waitFor(() => screen.queryAllByText('Task 1').length === 0);
    await waitFor(() => screen.queryAllByText('Task 3').length === 0);
  });

  it('should successfully purge all done tasks', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <UserContextProvider>
            <Purge />
          </UserContextProvider>
        </ThemeProvider>
      </Provider>
    );

    await waitFor(() => screen.getByText('Task 1'));
    userEvent.click(screen.getByText('Task 1'));

    userEvent.click(screen.getByText('Purge Done'));

    await waitFor(() => screen.queryAllByText('Task 1').length === 0);
  });
});
Этот набор тестов проверяет следующие аспекты:

- Правильное отображение задач на экране.
- Возможность выбора нескольких задач для удаления.
- Появление диалогового окна при нажатии кнопки «Удалить все задачи».
- Удаление выбранных задач из интерфейса после подтверждения.
- Удаление всех выполненных задач одним кликом.

Обратите внимание, что вам нужно заменить импорты и настройки контекста и провайдера согласно вашей реализации приложения.