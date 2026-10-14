import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SharePage from '../src/pages/Share.tsx';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../src/contexts/UserContext';
import { createMemoryContext } from './testUtils';

// Мокаем внешние зависимости
jest.mock('@mui/material', () => ({ /* mocks */ }));
jest.mock('@mui/icons-material', () => ({ /* mocks */ }));
jest.mock('../src/utils', () => ({ /* mocks */ }));

const mockUser = {
  categories: [],
  tasks: []
};

const mockSetUser = jest.fn();

const contextValue = createMemoryContext(UserContext, { user: mockUser, setUser: mockSetUser });

describe('SharePage', () => {
  describe('Рендеринг', () => {
    it('should render without errors', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.queryByTestId('root')).toBeInTheDocument();
    });

    it('should display alert when task is invalid', async () => {
      render(
        <MemoryRouter initialEntries={['/share?task=invalid']}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Invalid task or category color format./));
    });

    it('should display dialog with task details', async () => {
      const validTask = '{"name":"Valid Task","description":"Description","color": "#FF0000"}';
      render(
        <MemoryRouter initialEntries={['/share?task=' + encodeURIComponent(validTask)]}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Valid Task/));
    });

    it('should display error message for malformed task', async () => {
      render(
        <MemoryRouter initialEntries={['/share?task=malformed']}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Failed to decode task data./));
    });
  });

  describe('Обработка действий пользователя', () => {
    it('should navigate back after adding task', async () => {
      const validTask = '{"name":"Valid Task","description":"Description","color": "#FF0000"}';
      render(
        <MemoryRouter initialEntries={['/share?task=' + encodeURIComponent(validTask)]}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Valid Task/));
      userEvent.click(screen.getByText(/Add Task/));
      await waitFor(() => expect(mockSetUser).toHaveBeenCalled());
      expect(window.location.pathname).toEqual('/');
    });

    it('should decline task and navigate back', async () => {
      render(
        <MemoryRouter initialEntries={['/share?task=valid']}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Decline/));
      userEvent.click(screen.getByText(/Decline/));
      await waitFor(() => expect(window.location.pathname).toEqual('/'));
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: SharePage.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для SharePage
// ============================================
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import SharePage from './SharePage';

describe('SharePage Snapshot Tests', () => {
  describe('Default Props and States', () => {
    test('should match snapshot with default props and loading state', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with error state', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage error={true} errorDetails={'Test error details'} />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with valid task data', () => {
      const taskData = {
        name: 'Test Task',
        description: 'Test Description',
        color: '#FF0000',
        category: [{ id: 'test-cat-id', color: '#00FF00' }],
      };
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage taskData={taskData} />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('User Name Prop Variations', () => {
    test('should match snapshot with short user name prop', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage userNameParam='short-name' />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with long user name prop', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage userNameParam='a'.repeat(USER_NAME_MAX_LENGTH + 1) />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Task Data Prop Variations', () => {
    test('should match snapshot with empty task data', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage taskParam='' />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with invalid task data', () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage taskParam='invalid-data' />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with valid task data', () => {
      const taskData = {
        name: 'Valid Task',
        description: 'Valid Description',
        color: '#FF0000',
        category: [{ id: 'valid-cat-id', color: '#00FF00' }],
      };
      const tree = renderer
        .create(
          <MemoryRouter>
            <SharePage taskParam=LZString.compressToEncodedURIComponent(JSON.stringify(taskData)) />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: SharePage.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для SharePage
// ============================================
Вот пример кода интеграционного теста для компонента `SharePage`:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../contexts/UserContext'; // Предположим, что UserContext доступен здесь
import { reducer } from '../reducers'; // Предположим, что redux используется
import SharePage from './SharePage';

const server = setupServer(
  // Моки для имитации API запросов
  rest.get('/tasks/:id', (req, res, ctx) =>
    res(ctx.json({
      task: {
        id: 'test-task-id',
        name: 'Test Task Name',
        description: 'Test Description',
        color: '#ff0000',
        category: ['category1', 'category2'],
        sharedBy: 'Shared By'
      }
    }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('SharePage Integration Tests', () => {
  it('should successfully load and display task details', async () => {
    render(
      <Provider store={createStore(reducer)}>
        <MemoryRouter initialEntries={[{ pathname: '/share?task=test-task-id' }]}>
          <UserContext.Provider value={{ user: { categories: [], tasks: [] } }}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/Test Task Name/i)).toBeInTheDocument());
    expect(screen.queryByText(/Test Description/i)).toBeInTheDocument();
    expect(screen.queryByText(/shared by Shared By/i)).toBeInTheDocument();
  });

  it('should display an alert when task cannot be decoded', async () => {
    render(
      <Provider store={createStore(reducer)}>
        <MemoryRouter initialEntries={[{ pathname: '/share?task=invalid-data' }]}>
          <UserContext.Provider value={{ user: { categories: [], tasks: [] } }}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByRole('alert')).toBeInTheDocument());
    expect(screen.queryByText(/failed to decode task data/i)).toBeInTheDocument();
  });

  it('should allow adding task to user's list', async () => {
    render(
      <Provider store={createStore(reducer)}>
        <MemoryRouter initialEntries={[{ pathname: '/share?task=test-task-id' }]}>
          <UserContext.Provider value={{ user: { categories: [], tasks: [] } }}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/Test Task Name/i)).toBeInTheDocument());

    userEvent.click(screen.getByText(/Add Task/i));

    await waitFor(() => expect(screen.queryByText(/Added shared task/i)).toBeInTheDocument());
  });
});
Этот пример демонстрирует основные аспекты интеграции:

- Настройка моков API с помощью MSW.
- Имитация навигации через `MemoryRouter`.
- Использование контекста пользователя (`UserContext`) и Redux.
- Ожидание появления элементов на экране с использованием библиотеки `@testing-library/react`.
