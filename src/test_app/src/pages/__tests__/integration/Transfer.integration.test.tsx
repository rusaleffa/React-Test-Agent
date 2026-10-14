/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для Transfer
 * 
 * @file Transfer.integration.test.tsx
 * @description Тестирование Transfer 
 * @generated 2026-09-08T13:35:49.928Z
 * @type {integration}
 * @testCount 2
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
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../contexts/UserContext';
import { useStorageState } from '../hooks/useStorageState';
import Transfer from './Transfer'; // импортируйте компонент здесь

// создайте mock store или используйте реальный state
const initialState = {
  user: {
    createdAt: Date.now(),
    tasks: [
      {
        id: 'task1',
        name: 'Test Task',
        description: 'This is a test task',
        category: ['test-cat'],
        color: '#ff0000',
        emojisStyle: {},
      },
    ],
    categories: [
      {
        id: 'test-cat',
        name: 'Test Category',
        color: '#00ff00',
      },
    ],
  },
};

const store = createStore(() => initialState);

const server = setupServer(
  // моки API запросов
  rest.post('/api/sync', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Transfer Integration Tests', () => {
  it('should display tasks and allow selection', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserContext.Provider value={{ user: initialState.user, setUser: jest.fn() }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    expect(screen.queryByText('Test Task')).toBeInTheDocument();

    // проверка выбора задачи
    userEvent.click(screen.getByText('Test Task'));
    expect(useStorageState.mock.results[0].value).toEqual(['task1']);

    // проверка экспорта всех задач
    userEvent.click(screen.getByText(/Export All Tasks/i));
    expect(showToast).toHaveBeenCalledWith('Exported all tasks');

    // проверка импорта файла
    const fileInput = screen.getByLabelText('Select JSON File');
    userEvent.upload(fileInput, new Blob(['{"name": "New Task"}'], { type: 'application/json' }));
    expect(showToast).toHaveBeenCalledWith('Tasks Successfully Imported');

    // проверка сканирования QR-кода
    userEvent.click(screen.getByText(/Scan QR Code/i));
    userEvent.type(screen.getByRole('dialog'), 'http://localhost/test-link');
    userEvent.click(screen.getByRole('button', { name: /scan/i }));
    expect(navigate).toHaveBeenCalledWith('/test-link');
  });

  it('should handle errors properly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserContext.Provider value={{ user: initialState.user, setUser: jest.fn() }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter>
      </Provider>,
    );

    // проверка ошибки при неправильном файле
    const fileInput = screen.getByLabelText('Select JSON File');
    userEvent.upload(fileInput, new Blob(['{"name": 123}'], { type: 'application/json' }));
    expect(showToast).toHaveBeenCalledWith('Incorrect file type application/json.');

    // проверка ошибки при слишком большом размере файла
    userEvent.upload(fileInput, new Blob(['{"name": "a".repeat(1024 * 1024 * 7)}], { type: 'application/json' }));
    expect(showToast).toHaveBeenCalledWith('File size is too large');

    // проверка ошибки при некорректном формате категории
    userEvent.upload(fileInput, new Blob(['{"category": {"color": "red"}}'], { type: 'application/json' }));
    expect(showToast).toHaveBeenCalledWith('Imported file contains tasks with invalid color formats.');
  });
});