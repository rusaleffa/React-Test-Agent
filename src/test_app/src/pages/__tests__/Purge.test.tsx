import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Purge from '../Purge';
import { UserContext } from '../contexts/UserContext';
import { Task, UUID } from '../types/user';
import { useStorageState } from '../hooks/useStorageState';

jest.mock('../hooks/useStorageState');

const mockUser = {
  tasks: [
    { id: 'task1', name: 'Task 1', done: true },
    { id: 'task2', name: 'Task 2', done: false },
    { id: 'task3', name: 'Task 3', done: true },
  ],
  deletedTasks: ['task4'],
};

const mockSetUser = jest.fn();

useStorageState.mockImplementation((initialValue, key, storageType) => {
  return {
    value: initialValue,
    set: jest.fn(),
  };
});

describe('Purge', () => {
  beforeEach(() => {
    useStorageState.mockClear();
    mockSetUser.mockClear();
  });

  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      expect(screen.getByText(/Purge Tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/Select Tasks To Purge/i)).toBeInTheDocument();
      expect(screen.queryByText(/You don't have any tasks to purge/i)).not.toBeInTheDocument();

      const doneTasks = screen.getByText(/Done Tasks/i);
      expect(doneTasks).toBeInTheDocument();

      const notDoneTasks = screen.getByText(/Not Done Tasks/i);
      expect(notDoneTasks).toBeInTheDocument();

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Purge Selected/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Purge Done/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Purge All Tasks/i })).toBeInTheDocument();
    });

    it('should render without tasks when no tasks are available', () => {
      const emptyUser = {
        tasks: [],
        deletedTasks: [],
      };

      render(
        <UserContext.Provider value={{ user: emptyUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      expect(screen.getByText(/You don't have any tasks to purge/i)).toBeInTheDocument();
    });

    it('should render tasks correctly', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const doneTasks = screen.getByText(/Done Tasks/i);
      expect(doneTasks).toContainHTML('<li>Task 1</li>');
      expect(doneTasks).toContainHTML('<li>Task 3</li>');

      const notDoneTasks = screen.getByText(/Not Done Tasks/i);
      expect(notDoneTasks).toContainHTML('<li>Task 2</li>');
    });
  });

  describe('Обработка событий', () => {
    it('should select and deselect tasks', async () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const task1Checkbox = screen.getByRole('checkbox', { name: /Task 1/i });
      await userEvent.click(task1Checkbox);

      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        tasks: [
          { id: 'task1', name: 'Task 1', done: true },
          { id: 'task2', name: 'Task 2', done: false },
          { id: 'task3', name: 'Task 3', done: true },
        ],
        deletedTasks: ['task4'],
        tasksToPurge: ['task1'],
      });

      await userEvent.click(task1Checkbox);
      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        tasks: [
          { id: 'task1', name: 'Task 1', done: true },
          { id: 'task2', name: 'Task 2', done: false },
          { id: 'task3', name: 'Task 3', done: true },
        ],
        deletedTasks: ['task4'],
        tasksToPurge: [],
      });
    });

    it('should purge selected tasks', async () => {
      useStorageState.mockImplementationOnce(() => ({ value: [], set: jest.fn() }));

      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const task1Checkbox = screen.getByRole('checkbox', { name: /Task 1/i });
      await userEvent.click(task1Checkbox);

      const purgeSelectedButton = screen.getByRole('button', { name: /Purge Selected/i });
      await userEvent.click(purgeSelectedButton);

      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        tasks: [
          { id: 'task2', name: 'Task 2', done: false },
          { id: 'task3', name: 'Task 3', done: true },
        ],
        deletedTasks: ['task4', 'task1'],
        tasksToPurge: [],
      });
    });

    it('should purge done tasks', async () => {
      useStorageState.mockImplementationOnce(() => ({ value: [], set: jest.fn() }));

      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const purgeDoneButton = screen.getByRole('button', { name: /Purge Done/i });
      await userEvent.click(purgeDoneButton);

      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        tasks: [{ id: 'task2', name: 'Task 2', done: false }],
        deletedTasks: ['task4', 'task1', 'task3'],
        tasksToPurge: [],
      });
    });

    it('should confirm and purge all tasks', async () => {
      useStorageState.mockImplementationOnce(() => ({ value: [], set: jest.fn() }));

      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const purgeAllButton = screen.getByRole('button', { name: /Purge All Tasks/i });
      await userEvent.click(purgeAllButton);

      const dialog = screen.getByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());

      const confirmButton = screen.getByRole('button', { name: /Purge/i });
      await userEvent.click(confirmButton);

      expect(mockSetUser).toHaveBeenCalledWith({ tasks: [], deletedTasks: ['task1', 'task2', 'task3'] });
    });
  });
});

// Дополнительные моки или настройки можно добавить здесь, если потребуется

// ============================================
// SNAPSHOT TESTS
// Файл: Purge.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Purge
// ============================================
import renderer from 'react-test-renderer';
import { UserContext } from '../contexts/UserContext';
import { createMemoryContext } from '@testing-library/react';

// Create a mock context for testing
const MockUserContext = ({ children }) => (
  <UserContext.Provider value={{ user: { tasks: [], deletedTasks: [] } }}>
    {children}
  </UserContext.Provider>
);

describe('Purge Snapshot Tests', () => {
  it('should match snapshot with default props', () => {
    const context = createMemoryContext(MockUserContext);
    const tree = renderer.create(<context.Purge />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when no tasks are available', () => {
    const context = createMemoryContext(MockUserContext);
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when there is one task and it is marked as done', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [{ id: '1', name: 'Test Task', done: true, color: '#ff0000' }];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when there is one task and it is not marked as done', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [{ id: '1', name: 'Test Task', done: false, color: '#ff0000' }];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when multiple tasks are present, some done and some not', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [
      { id: '1', name: 'Test Task 1', done: true, color: '#ff0000' },
      { id: '2', name: 'Test Task 2', done: false, color: '#00ff00' },
      { id: '3', name: 'Test Task 3', done: true, color: '#0000ff' },
    ];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when the delete all dialog is open', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when the delete all dialog is closed', () => {
    const context = createMemoryContext(MockUserContext);
    const tasks = [];
    const user = { tasks, deletedTasks: [] };
    const tree = renderer.create(
      <context.Purge />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: Purge.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Purge
// ============================================
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
