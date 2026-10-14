import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TasksList from './TasksList';
import { TaskContext } from '../../contexts/TaskContext';
import { UserContext } from '../../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

const mockUser = {
  settings: {},
  tasks: []
};

const mockTaskContext = {
  selectedTaskId: '',
  setSelectedTaskId: jest.fn(),
  anchorEl: null,
  setAnchorEl: jest.fn(),
  setAnchorPosition: jest.fn(),
  search: '',
  setSearch: jest.fn(),
  highlightMatchingText: false,
  multipleSelectedTasks: [],
  setMultipleSelectedTasks: jest.fn(),
  handleSelectTask: jest.fn(),
  editModalOpen: false,
  setEditModalOpen: jest.fn(),
  deleteDialogOpen: false,
  setDeleteDialogOpen: jest.fn(),
  sortOption: '',
  moveMode: false,
  setMoveMode: jest.fn()
};

const mockUserContext = {
  user: mockUser,
  setUser: jest.fn()
};

const theme = createTheme({});

describe('TasksList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(screen.queryByTestId('root')).toBeInTheDocument();
    });

    it('renders no tasks message when there are no tasks', () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(screen.getByText(/You don't have any tasks yet/i)).toBeInTheDocument();
    });

    it('renders tasks when they exist', () => {
      const mockTasks = [
        { id: '1', name: 'Task 1' },
        { id: '2', name: 'Task 2' }
      ];
      const mockTaskContext = {
        ...mockTaskContext,
        user: {
          ...mockUser,
          tasks: mockTasks
        }
      };
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('renders search input and clear button', () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(screen.getByPlaceholderText('Search for task...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });

    it('renders categories when enabled', () => {
      const mockCategories = [{ id: '1', name: 'Category 1' }];
      const mockTaskContext = {
        ...mockTaskContext,
        user: {
          ...mockUser,
          settings: {
            enableCategories: true
          },
          tasks: [],
          categories: mockCategories
        }
      };
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    it('renders task action container when multiple tasks are selected', () => {
      const mockTaskContext = {
        ...mockTaskContext,
        multipleSelectedTasks: ['1', '2']
      };
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter>
      );
      expect(screen.getByText('Selected 2 task(s)')).toBeInTheDocument();
    });

    it('renders move mode when enabled', () => {
      const mockTaskContext = {
        ...mockTaskContext,
        moveMode: true
      };
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter
      );
      expect(screen.getByText('Move Mode Enabled')).toBeInTheDocument();
    });
  });

  describe('Events', () => {
    it('handles click events on task menu button', () => {
      const mockTaskContext = {
        ...mockTaskContext,
        selectedTaskId: '1',
        anchorEl: null,
        setAnchorEl: jest.fn(),
        setAnchorPosition: jest.fn()
      };
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter
      );
      const taskMenuButton = screen.getByRole('button', { name: /Task Menu/i });
      userEvent.click(taskMenuButton);
      expect(mockTaskContext.setAnchorEl).toHaveBeenCalledWith(taskMenuButton);
    });

    it('handles search input change', async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter
      );
      const searchInput = screen.getByPlaceholderText('Search for task...');
      await userEvent.type(searchInput, 'test');
      expect(mockTaskContext.setSearch).toHaveBeenCalledWith('test');
    });

    it('handles clear search', async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter
      );
      const searchInput = screen.getByPlaceholderText('Search for task...');
      await userEvent.type(searchInput, 'test');
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      await userEvent.click(clearButton);
      expect(mockTaskContext.setSearch).toHaveBeenCalledWith('');
    });

    it('handles mark selected as done', () => {
      const mockTaskContext = {
        ...mockTaskContext,
        multipleSelectedTasks: ['1', '2'],
        user: {
          ...mockUser,
          tasks: [
            { id: '1', done: false },
            { id: '2', done: false }
          ]
        }
      };
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter
      );
      const markSelectedAsDoneButton = screen.getByRole('button', { name: /Mark selected as done/i });
      userEvent.click(markSelectedAsDoneButton);
      expect(mockTaskContext.user.tasks[0].done).toEqual(true);
      expect(mockTaskContext.user.tasks[1].done).toEqual(true);
    });

    it('handles delete selected tasks', () => {
      const mockTaskContext = {
        ...mockTaskContext,
        multipleSelectedTasks: ['1', '2'],
        user: {
          ...mockUser,
          tasks: [
            { id: '1' },
            { id: '2' }
          ]
        }
      };
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter
      );
      const deleteSelectedButton = screen.getByRole('button', { name: /Delete selected/i });
      userEvent.click(deleteSelectedButton);
      expect(mockTaskContext.setDeleteSelectedOpen).toHaveBeenCalledWith(true);
    });

    it('handles drag and drop', () => {
      const mockTaskContext = {
        ...mockTaskContext,
        user: {
          ...mockUser,
          tasks: [
            { id: '1', position: 0 },
            { id: '2', position: 1 }
          ]
        }
      };
      render(
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={mockUserContext}>
              <TaskContext.Provider value={mockTaskContext}>
                <TasksList />
              </TaskContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </MemoryRouter
      );
      const firstTask = screen.getByRole('link', { name: /Task 1/i });
      const secondTask = screen.getByRole('link', { name: /Task 2/i });
      userEvent.drag(firstTask, { x: 0, y: 100 });
      userEvent.drop(secondTask, { x: 0, y: 0 });
      expect(mockTaskContext.user.tasks[0].position).toEqual(1);
      expect(mockTaskContext.user.tasks[1].position).toEqual(0);
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: TasksList.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TasksList
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@emotion/react';
import { UserContext, TaskContext } from '../../contexts';
import { createMemoryRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router';
import { TasksList } from './TasksList';

// Mock contexts
const mockUserContext = {
  user: {
    settings: {},
    tasks: []
  },
  setUser: jest.fn()
};

const mockTaskContext = {
  selectedTaskId: '',
  setSelectedTaskId: jest.fn(),
  anchorEl: null,
  setAnchorEl: jest.fn(),
  setAnchorPosition: jest.fn(),
  search: '',
  setSearch: jest.fn(),
  highlightMatchingText: false,
  multipleSelectedTasks: [],
  setMultipleSelectedTasks: jest.fn(),
  handleSelectTask: jest.fn(),
  editModalOpen: false,
  setEditModalOpen: jest.fn(),
  deleteDialogOpen: false,
  setDeleteDialogOpen: jest.fn(),
  sortOption: 'dateCreated',
  moveMode: false,
  setMoveMode: jest.fn()
};

// Create a memory router to simulate routing
const router = createMemoryRouter([
  {
    path: '/',
    element: <BrowserRouter><TasksList /></BrowserRouter>
  }
]);

describe('TasksList Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider>
          <UserContext.Provider value={mockUserContext}>
            <TaskContext.Provider value={mockTaskContext}>
              {router}
            </TaskContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when no tasks', () => {
    const mockTaskContextWithEmptyTasks = {
      ...mockTaskContext,
      user: {
        ...mockUserContext.user,
        tasks: []
      }
    };
    const tree = renderer
      .create(
        <ThemeProvider>
          <UserContext.Provider value={mockUserContext}>
            <TaskContext.Provider value={mockTaskContextWithEmptyTasks}>
              {router}
            </TaskContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when tasks exist but no search', () => {
    const mockTaskContextWithTasks = {
      ...mockTaskContext,
      user: {
        ...mockUserContext.user,
        tasks: [{ id: '1' }]
      }
    };
    const tree = renderer
      .create(
        <ThemeProvider>
          <UserContext.Provider value={mockUserContext}>
            <TaskContext.Provider value={mockTaskContextWithTasks}>
              {router}
            </TaskContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when tasks exist and search results are empty', () => {
    const mockTaskContextWithSearchResults = {
      ...mockTaskContext,
      user: {
        ...mockUserContext.user,
        tasks: [{ id: '1' }],
        search: 'nonexistent'
      }
    };
    const tree = renderer
      .create(
        <ThemeProvider>
          <UserContext.Provider value={mockUserContext}>
            <TaskContext.Provider value={mockTaskContextWithSearchResults}>
              {router}
            </TaskContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when tasks exist and search results are present', () => {
    const mockTaskContextWithSearchResults = {
      ...mockTaskContext,
      user: {
        ...mockUserContext.user,
        tasks: [{ id: '1', name: 'Test Task' }],
        search: 'test'
      }
    };
    const tree = renderer
      .create(
        <ThemeProvider>
          <UserContext.Provider value={mockUserContext}>
            <TaskContext.Provider value={mockTaskContextWithSearchResults}>
              {router}
            </TaskContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when tasks exist and multiple tasks are selected', () => {
    const mockTaskContextWithSelectedTasks = {
      ...mockTaskContext,
      user: {
        ...mockUserContext.user,
        tasks: [{ id: '1', name: 'Test Task' }]
      },
      multipleSelectedTasks: ['1']
    };
    const tree = renderer
      .create(
        <ThemeProvider>
          <UserContext.Provider value={mockUserContext}>
            <TaskContext.Provider value={mockTaskContextWithSelectedTasks}>
              {router}
            </TaskContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when tasks exist and move mode is enabled', () => {
    const mockTaskContextWithMoveMode = {
      ...mockTaskContext,
      moveMode: true
    };
    const tree = renderer
      .create(
        <ThemeProvider>
          <UserContext.Provider value={mockUserContext}>
            <TaskContext.Provider value={mockTaskContextWithMoveMode}>
              {router}
            </TaskContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when tasks exist and delete dialog is open', () => {
    const mockTaskContextWithDeleteDialog = {
      ...mockTaskContext,
      deleteDialogOpen: true
    };
    const tree = renderer
      .create(
        <ThemeProvider>
          <UserContext.Provider value={mockUserContext}>
            <TaskContext.Provider value={mockTaskContextWithDeleteDialog}>
              {router}
            </TaskContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when tasks exist and edit modal is open', () => {
    const mockTaskContextWithEditModal = {
      ...mockTaskContext,
      editModalOpen: true
    };
    const tree = renderer
      .create(
        <ThemeProvider>
          <UserContext.Provider value={mockUserContext}>
            <TaskContext.Provider value={mockTaskContextWithEditModal}>
              {router}
            </TaskContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: TasksList.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TasksList
// ============================================
Ниже представлен пример кода интеграционного тестирования компонента `TasksList` в соответствии с указанными требованиями и структурой.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TasksList } from './TasksList'; // импортируйте компонент здесь
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { TaskContext, UserContext } from '../../contexts';
import { store } from '../../store';
import { Task } from '../../types/user';

// создайте моки данных для задач и пользователей
const mockTasks = [
  { id: 'task1', name: 'Task One', description: 'Description One' },
  { id: 'task2', name: 'Task Two', description: 'Description Two' },
];
const mockUser = { tasks: mockTasks };

const history = createMemoryHistory({ initialEntries: ['/'] });

const server = setupServer(
  // моки API запросов
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.json(mockTasks));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TasksList Integration Tests', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <UserContext.Provider value={{ user: mockUser }}>
            <TaskContext.Provider value={{ selectedTaskId: '', setSelectedTaskId: jest.fn(), anchorEl: null, setAnchorEl: jest.fn(), setAnchorPosition: jest.fn(), search: '', setSearch: jest.fn(), highlightMatchingText: jest.fn(), multipleSelectedTasks: [], setMultipleSelectedTasks: jest.fn(), handleSelectTask: jest.fn(), editModalOpen: false, setEditModalOpen: jest.fn(), deleteDialogOpen: false, setDeleteDialogOpen: jest.fn(), sortOption: 'dateCreated', moveMode: false, setMoveMode: jest.fn() }}>
              <TasksList />
            </TaskContext.Provider>
          </UserContext.Provider>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should load and display tasks', async () => {
    await waitFor(() => expect(screen.queryByRole('heading')).toBeInTheDocument());

    // проверьте отображение заголовка задачи
    expect(screen.getByText(/Task One/i)).toBeInTheDocument();
    expect(screen.getByText(/Task Two/i)).toBeInTheDocument();

    // проверка поиска задач
    userEvent.type(screen.getByPlaceholderText('Search for task...'), 'Task One');
    await waitFor(() => expect(screen.getByText(/Task One/i)).toBeInTheDocument());

    // проверка удаления задачи
    userEvent.click(screen.getByText('Task One'));
    userEvent.click(screen.getByText('Delete'));
    userEvent.click(screen.getByText('Confirm Delete'));

    await waitFor(() => expect(screen.queryByText(/Task One/i)).not.toBeInTheDocument());
  });

  it('should mark task as done', async () => {
    // выберите задачу
    userEvent.click(screen.getByText('Task One'));

    // нажмите кнопку "Mark as done"
    userEvent.click(screen.getByText('Mark selected as done'));

    // проверим состояние задачи после выполнения действия
    await waitFor(() => expect(screen.queryByText(/Task One/i)).toHaveAttribute('data-done', 'true'));
  });

  it('should allow drag-and-drop sorting', async () => {
    // перетащите первую задачу ниже второй
    userEvent.drag(screen.getByText('Task One'), screen.getByText('Task Two'));

    // проверим порядок задач после перетаскивания
    await waitFor(() => expect(screen.getByText('Task One')).toBeBelow(screen.getByText('Task Two')));
  });
});
Этот пример демонстрирует базовую структуру интеграционного теста для компонента `TasksList`. В нем используются следующие инструменты и библиотеки:

- **MSW** — для мокирования API-запросов.
- **@testing-library/react** — для рендеринга компонентов и проверки DOM-элементов.
- **userEvent** — для симуляции пользовательских взаимодействий.
- **MemoryRouter** — для имитации маршрутизации.
- **Provider** — для предоставления контекста Redux и других контекстов приложения.

Вы можете расширить этот пример дополнительными тестами, такими как тестирование ошибок, состояний загрузки, событий кликов и т.д., в зависимости от требований вашего проекта.
