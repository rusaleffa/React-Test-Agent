import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import TaskMenu from './TaskMenu';
import { TaskContext } from '../../contexts/TaskContext';
import { UserContext } from '../../contexts/UserContext';
import { createMemoryContext } from '../../testUtils';

// Создание моков для контекстов
const mockUserContext = createMemoryContext(UserContext, {
  user: {
    tasks: [],
    settings: {},
  },
  setUser: jest.fn(),
});
const mockTaskContext = createMemoryContext(TaskContext, {
  selectedTaskId: '',
  anchorEl: null,
  anchorPosition: null,
  multipleSelectedTasks: [],
  handleSelectTask: jest.fn(),
  setEditModalOpen: jest.fn(),
  handleDeleteTask: jest.fn(),
  handleCloseMoreMenu: jest.fn(),
  moveMode: false,
  setMoveMode: jest.fn(),
  setSearch: jest.fn(),
});

// Настройка рендера с контекстами
function renderWithContexts(ui) {
  return render(
    <MemoryRouter>
      <UserContext.Provider value={mockUserContext}>
        <TaskContext.Provider value={mockTaskContext}>
          {ui}
        </TaskContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );
}

describe('TaskMenu', () => {
  describe('Рендеринг', () => {
    it('should render without errors', () => {
      renderWithContexts(<TaskMenu />);
      expect(screen.queryByRole('menu')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      renderWithContexts(<TaskMenu />);
      expect(screen.getByRole('menu')).toHaveTextContent('Mark as done');
      expect(screen.getByRole('menu')).toHaveTextContent('Pin');
      expect(screen.getByRole('menu')).toHaveTextContent('Select');
      expect(screen.getByRole('menu')).toHaveTextContent('Move');
      expect(screen.getByRole('menu')).toHaveTextContent('Task details');
      expect(screen.getByRole('menu')).toHaveTextContent('Read Aloud');
      expect(screen.getByRole('menu')).toHaveTextContent('Share');
      expect(screen.getByRole('menu')).toHaveTextContent('Edit');
      expect(screen.getByRole('menu')).toHaveTextContent('Duplicate');
      expect(screen.getByRole('menu')).toHaveTextContent('Delete');
    });

    it('should render with selected task', () => {
      const selectedTask = {
        name: 'Test Task',
        description: 'Test Description',
        date: new Date(),
        deadline: new Date(),
      };
      renderWithContexts(<TaskMenu selectedTask={selectedTask} />);
      expect(screen.getByRole('menuitem')).toHaveTextContent('Test Task');
      expect(screen.getByRole('menuitem')).toHaveTextContent('Test Description');
    });
  });

  describe('Обработка событий', () => {
    let mockHandleSelectTask;
    let mockHandleDeleteTask;
    let mockSetEditModalOpen;

    beforeEach(() => {
      mockHandleSelectTask = jest.fn();
      mockHandleDeleteTask = jest.fn();
      mockSetEditModalOpen = jest.fn();
      mockTaskContext.set({
        handleSelectTask: mockHandleSelectTask,
        handleDeleteTask: mockHandleDeleteTask,
        setEditModalOpen: mockSetEditModalOpen,
      });
    });

    it('should call handleSelectTask on click', async () => {
      renderWithContexts(<TaskMenu />);
      await userEvent.click(screen.getByRole('menuitem', { name: 'Select' }));
      expect(mockHandleSelectTask).toHaveBeenCalledTimes(1);
    });

    it('should call handleDeleteTask on delete click', async () => {
      renderWithContexts(<TaskMenu />);
      await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
      expect(mockHandleDeleteTask).toHaveBeenCalledTimes(1);
    });

    it('should call setEditModalOpen on edit click', async () => {
      renderWithContexts(<TaskMenu />);
      await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
      expect(mockSetEditModalOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('Вспомогательные функции', () => {
    it('should mark task as done', () => {
      const mockTask = {
        id: 'test-id',
        done: false,
      };
      mockTaskContext.set({
        selectedTaskId: 'test-id',
        tasks: [mockTask],
      });
      renderWithContexts(<TaskMenu />);
      userEvent.click(screen.getByRole('menuitem', { name: 'Mark as done' }));
      expect(mockTaskContext.get()).toEqual({
        selectedTaskId: 'test-id',
        tasks: [{ ...mockTask, done: true }],
      });
    });

    it('should pin/unpin task', () => {
      const mockTask = {
        id: 'test-id',
        pinned: false,
      };
      mockTaskContext.set({
        selectedTaskId: 'test-id',
        tasks: [mockTask],
      });
      renderWithContexts(<TaskMenu />);
      userEvent.click(screen.getByRole('menuitem', { name: 'Pin' }));
      expect(mockTaskContext.get()).toEqual({
        selectedTaskId: 'test-id',
        tasks: [{ ...mockTask, pinned: true }],
      });
    });

    it('should duplicate task', () => {
      const mockTask = {
        id: 'test-id',
        date: new Date(),
        lastSave: undefined,
      };
      mockTaskContext.set({
        selectedTaskId: 'test-id',
        tasks: [mockTask],
      });
      renderWithContexts(<TaskMenu />);
      userEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
      expect(mockTaskContext.get()).toEqual({
        selectedTaskId: 'test-id',
        tasks: [
          { ...mockTask, id: expect.stringMatching(/^task-/), date: new Date(), lastSave: undefined },
          mockTask,
        ],
      });
    });

    it('should read aloud task', () => {
      renderWithContexts(<TaskMenu />);
      userEvent.click(screen.getByRole('menuitem', { name: 'Read Aloud' }));
      expect(screen.queryByRole('marquee')).toBeInTheDocument();
    });

    it('should share task', () => {
      renderWithContexts(<TaskMenu />);
      userEvent.click(screen.getByRole('menuitem', { name: 'Share' }));
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });
});

// Функция создания памяти контекста
function createMemoryContext(context, values) {
  const contextValue = { ...values };
  const ContextProvider = ({ children }) => (
    <context.Provider value={contextValue}>{children}</context.Provider>
  );
  return ContextProvider;
}

// ============================================
// SNAPSHOT TESTS
// Файл: TaskMenu.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TaskMenu
// ============================================
import renderer from 'react-test-renderer';
import { TaskContext } from '../../contexts/TaskContext';
import { UserContext } from '../../contexts/UserContext';
import { TaskMenu } from './TaskMenu';

// Mock contexts
const mockTaskContext = {
  tasks: [],
  selectedTaskId: '',
  anchorEl: null,
  anchorPosition: null,
  multipleSelectedTasks: [],
  handleSelectTask: jest.fn(),
  handleDeleteTask: jest.fn(),
  handleCloseMoreMenu: jest.fn(),
  moveMode: false,
  setMoveMode: jest.fn(),
  setEditModalOpen: jest.fn(),
  setSearch: jest.fn(),
};

const mockUserContext = {
  user: {
    tasks: [],
    settings: {},
  },
  setUser: jest.fn(),
};

// Rendering snapshots
describe('TaskMenu Snapshots', () => {
  test('default state', () => {
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: mockTaskContext,
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with selected task', () => {
    const selectedTask = {
      id: 'test-id',
      name: 'Test Task',
      date: new Date(),
      done: false,
      pinned: false,
    };
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: {
        ...mockTaskContext,
        selectedTaskId: selectedTask.id,
        selectedTask: selectedTask,
      },
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with multiple selected tasks', () => {
    const selectedTaskIds = ['task1', 'task2'];
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: {
        ...mockTaskContext,
        multipleSelectedTasks: selectedTaskIds,
      },
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with edit modal open', () => {
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: {
        ...mockTaskContext,
        setEditModalOpen: jest.fn(),
      },
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with delete task action', () => {
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: {
        ...mockTaskContext,
        handleDeleteTask: jest.fn(),
      },
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with share dialog open', () => {
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: {
        ...mockTaskContext,
        setShowShareDialog: jest.fn(),
      },
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with mark as done', () => {
    const selectedTask = {
      id: 'test-id',
      name: 'Test Task',
      date: new Date(),
      done: false,
    };
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: {
        ...mockTaskContext,
        selectedTaskId: selectedTask.id,
        selectedTask: selectedTask,
        handleMarkAsDone: jest.fn(),
      },
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with pin task', () => {
    const selectedTask = {
      id: 'test-id',
      name: 'Test Task',
      date: new Date(),
      pinned: false,
    };
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: {
        ...mockTaskContext,
        selectedTaskId: selectedTask.id,
        selectedTask: selectedTask,
        handlePin: jest.fn(),
      },
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with duplicate task', () => {
    const selectedTask = {
      id: 'test-id',
      name: 'Test Task',
      date: new Date(),
    };
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: {
        ...mockTaskContext,
        selectedTaskId: selectedTask.id,
        selectedTask: selectedTask,
        handleDuplicateTask: jest.fn(),
      },
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with read aloud', () => {
    const contextValue = {
      UserContext: mockUserContext,
      TaskContext: {
        ...mockTaskContext,
        handleReadAloud: jest.fn(),
      },
    };
    const tree = renderer
      .create(
        <UserContext.Provider value={contextValue.UserContext}>
          <TaskContext.Provider value={contextValue.TaskContext}>
            <TaskMenu />
          </TaskContext.Provider>
        </UserContext.Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: TaskMenu.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TaskMenu
// ============================================
Вот пример кода интеграционного теста для компонента `TaskMenu`:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskMenu } from './TaskMenu'; // импортируйте компонент здесь
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContextProvider } from '../../contexts/UserContext';
import { TaskContextProvider } from '../../contexts/TaskContext';
import { reducer } from '../../reducers/index'; // замените на ваш редуктор

// создайте сервер моков
const server = setupServer(
  // добавьте моки сюда
  rest.get('/api/tasks', (req, res, ctx) =>
    res(ctx.json([
      {
        id: '1',
        name: 'Test Task',
        description: 'Test Description',
        date: '2023-09-01T12:00:00Z',
        deadline: '2023-09-15T12:00:00Z',
        done: false,
        pinned: false,
        lastSave: null,
      },
    ])),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// создайте mock store
const initialState = {
  user: {
    tasks: [],
    settings: {},
  },
  tasks: {
    selectedTaskId: '',
    anchorEl: null,
    anchorPosition: null,
    multipleSelectedTasks: [],
    handleSelectTask: jest.fn(),
    setEditModalOpen: jest.fn(),
    handleDeleteTask: jest.fn(),
    handleCloseMoreMenu: jest.fn(),
    moveMode: false,
    setMoveMode: jest.fn(),
    setSearch: jest.fn(),
  },
};
const store = createStore(reducer, initialState);

describe('TaskMenu Integration Tests', () => {
  it('should render correctly and trigger actions', async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <UserContextProvider>
            <TaskContextProvider>
              <TaskMenu />
            </TaskContextProvider>
          </UserContextProvider>
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(store.getState().tasks.handleSelectTask).toHaveBeenCalledTimes(1));

    // проверьте отображение элементов меню
    expect(screen.getByText('Mark as done')).toBeInTheDocument();
    expect(screen.getByText('Mark as not done')).not.toBeInTheDocument();
    expect(screen.getByText('Pin')).toBeInTheDocument();
    expect(screen.getByText('Unpin')).not.toBeInTheDocument();

    // симуляция клика на элемент меню
    userEvent.click(screen.getByText('Mark as done'));

    // проверка изменений в состоянии после клика
    await waitFor(() => expect(store.getState().tasks.selectedTaskId).toEqual('1'));
    expect(store.getState().tasks.tasks[0].done).toBe(true);

    // симуляция удаления задачи
    userEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(store.getState().tasks.handleDeleteTask).toHaveBeenCalledTimes(1));
  });
});
### Примечания к примеру выше:
- **MSW**: используется для создания мок-сервера и имитации API-запросов.
- **Redux**: создается mock-store для проверки действий и состояний приложения.
- **Testing Library**: используется для рендера компонентов и выполнения пользовательских взаимодействий.
- **Jest**: проверяет вызовы функций и изменения в состояниях.

Этот шаблон можно адаптировать под конкретные требования вашего проекта и добавить дополнительные тесты для других функциональных возможностей компонента.
