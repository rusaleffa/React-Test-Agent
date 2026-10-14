import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserContext } from '../UserContext';
import { defaultUser } from '../constants/defaultUser';

describe('UserContext', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<UserContext />);
      expect(screen.queryByRole('context')).toBeInTheDocument();
      expect(screen.queryByText(defaultUser.name)).toBeInTheDocument();
    });

    it('should render with custom props', () => {
      const customUser = { name: 'John Doe' };
      const setUserMock = jest.fn();
      render(
        <UserContext.Provider value={{ user: customUser, setUser: setUserMock }}>
          <div>Test</div>
        </UserContext.Provider>
      );
      expect(screen.queryByText(customUser.name)).toBeInTheDocument();
      expect(setUserMock).not.toHaveBeenCalled(); // Проверяем отсутствие вызова обработчика
    });
  });

  describe('Обновление состояния', () => {
    let setUserMock;
    beforeEach(() => {
      setUserMock = jest.fn();
    });

    it('should call setUser when updating state', () => {
      render(
        <UserContext.Provider value={{ user: defaultUser, setUser: setUserMock }}>
          <button onClick={() => setUserMock({ name: 'New Name' })} />
        </UserContext.Provider>
      );
      userEvent.click(screen.getByRole('button'));
      expect(setUserMock).toHaveBeenCalledWith({ name: 'New Name' });
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: UserContext.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для UserContext
// ============================================
import renderer from 'react-test-renderer';
import { UserContext } from './UserContext'; // Импортируйте корректный путь к вашему компоненту

const defaultUser = { id: 1, name: 'John Doe' };

// Тест с пустыми пропсами и состоянием по умолчанию
test('should match snapshot with empty props and default state', () => {
  const tree = renderer.create(
    <UserContext>
      <div>Content</div>
    </UserContext>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Тест с заданными пользователем данными и функцией обновления
test('should match snapshot with custom user and setUser function', () => {
  const user = { id: 2, name: 'Jane Smith' };
  const setUserMock = jest.fn();
  const tree = renderer.create(
    <UserContext.Provider value={{ user, setUser: setUserMock }}>
      <div>Content</div>
    </UserContext.Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Тест с ошибкой в состоянии
test('should match snapshot when in error state', () => {
  const errorMessage = 'Error fetching user data';
  const tree = renderer.create(
    <UserContext.Provider value={{ user: null, setUser: () => {}, error: errorMessage }}>
      <div>Content</div>
    </UserContext.Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// Тест со статусом загрузки данных
test('should match snapshot when loading', () => {
  const tree = renderer.create(
    <UserContext.Provider value={{ user: null, setUser: () => {}, isLoading: true }}>
      <div>Content</div>
    </UserContext.Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

// ============================================
// INTEGRATION TESTS
// Файл: UserContext.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для UserContext
// ============================================
Вот пример кода интеграционного теста для компонента `UserContext`:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserContextProvider } from './UserContext'; // Предположим, что это путь к вашему провайдеру контекста
import { defaultUser } from '../constants/defaultUser';

// Моки сервер API
const server = setupServer(
  rest.get('/users/current', (req, res, ctx) =>
    res(ctx.json({ user: { ...defaultUser, name: 'John Doe' } }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserContext Integration Tests', () => {
  it('should load initial context state and display user info', async () => {
    render(<UserContextProvider><div>Test Component</div></UserContextProvider>);

    await waitFor(() => expect(screen.queryByText(/John Doe/i)).toBeInTheDocument());

    expect(screen.queryByText(/John Doe/i)).not.toBeNull();
  });

  it('should update the user context when a new user is fetched', async () => {
    render(<UserContextProvider><div>Test Component</div></UserContextProvider>);

    // Имитация клика на кнопку или действия, вызывающего обновление данных пользователя
    userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(screen.queryByText(/Jane Smith/i)).toBeInTheDocument());

    expect(screen.queryByText(/Jane Smith/i)).not.toBeNull();
  });

  it('should handle loading state correctly', async () => {
    render(<UserContextProvider><div>Test Component</div></UserContextProvider>);

    // Ожидаем состояние загрузки
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).toBeInTheDocument());

    expect(screen.queryByText(/Loading.../i)).not.toBeNull();

    // После завершения загрузки ожидаем отображение имени пользователя
    await waitFor(() => expect(screen.queryByText(/John Doe/i)).toBeInTheDocument());

    expect(screen.queryByText(/John Doe/i)).not.toBeNull();
  });

  it('should handle error state correctly', async () => {
    server.use(
      rest.get('/users/current', (req, res, ctx) => res(ctx.status(404)))
    );

    render(<UserContextProvider><div>Test Component</div></UserContextProvider>);

    // Ожидаем сообщение об ошибке
    await waitFor(() => expect(screen.queryByText(/Error fetching user/i)).toBeInTheDocument());

    expect(screen.queryByText(/Error fetching user/i)).not.toBeNull();
  });
});
Этот набор тестов проверяет следующие аспекты:

- Загрузку начального значения контекста (`defaultUser`)
- Обновление пользовательских данных при взаимодействии с интерфейсом
- Правильное отображение состояний загрузки и ошибок в контексте.
