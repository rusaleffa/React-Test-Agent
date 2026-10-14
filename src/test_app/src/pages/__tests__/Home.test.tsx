import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Home from '../Home';
import { UserContext } from '../contexts/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import TasksList from '../components/tasks/TasksList';
import AnimatedGreeting from '../components/AnimatedGreeting';
import Offline from '../components/offline/Offline';
import ProgressPercentageContainer from '../styles/ProgressPercentageContainer';
import StyledProgress from '../styles/StyledProgress';
import TaskCountClose from '../styles/TaskCountClose';
import TaskCountHeader from '../styles/TaskCountHeader';
import TaskCountTextContainer from '../styles/TaskCountTextContainer';
import TasksCount from '../styles/TasksCount';
import TasksCountContainer from '../styles/TasksCountContainer';
import AddButton from '../components/buttons/AddButton';
import GreetingHeader from '../components/greeting/GreetingHeader';
import { Emoji } from 'emoji-picker-react';
import { Box, Button, CircularProgress, Tooltip, Typography } from '@mui/material';
import { AddRounded, CloseRounded, TodayRounded, UndoRounded, WifiOff } from '@mui/icons-material';

const mockUser = {
  user: {
    tasks: [],
    emojisStyle: {},
    settings: {
      showProgressBar: true,
      enableGlow: true,
    },
    name: '',
  },
  setUser: jest.fn(),
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={mockUser}>{children}</UserContext.Provider>
);

describe('Home', () => {
  describe('Рендеринг', () => {
    it('should render without errors', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );
      expect(screen.queryByTestId('root')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('heading', { name: /good/i })).toBeInTheDocument();
      expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-label', 'Add Task');
      expect(screen.getByText(/you have/i)).toBeInTheDocument();
      expect(screen.getByText(/progress/i)).toBeInTheDocument();
      expect(screen.getByText(/add new task/i)).toBeInTheDocument();
    });

    it('should render offline message', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('alert')).toHaveTextContent('You're offline but you can use the app!');
    });

    it('should render animated greeting', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render tasks list', async () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      await waitFor(() => expect(screen.getByRole('listitem')).toBeInTheDocument());
    });

    it('should render add button for mobile devices', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.queryByRole('button', { name: /add new task/i })).not.toBeInTheDocument();
    });

    it('should render add button for non-mobile devices', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    it('should handle click event on add button', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      userEvent.click(screen.getByRole('button', { name: /add task/i }));
      expect(mockUser.setUser).toHaveBeenCalledTimes(1);
    });

    it('should handle click event on close progress bar', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      userEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(mockUser.setUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('Проверки пропсов', () => {
    it('should pass props to child components', () => {
      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(screen.getByRole('heading').closest('.MuiTypography-root')).toHaveStyle({
        fontFamily: 'Roboto',
      });
      expect(screen.getByRole('link').closest('.MuiButton-root')).toHaveStyle({
        backgroundColor: '#ffc107',
      });
    });
  });

  describe('Моки внешних API', () => {
    it('should mock online status', () => {
      const mockIsOnline = jest.fn().mockReturnValue(false);
      global.navigator.onLine = false;

      render(
        <MockUserContext>
          <Router>
            <Home />
          </Router>
        </MockUserContext>,
      );

      expect(mockIsOnline).toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent('You're offline but you can use the app!');
    });
  });
});

// Дополнительные моки для дочерних компонентов можно добавить здесь, если потребуется

// ============================================
// SNAPSHOT TESTS
// Файл: Home.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Home
// ============================================
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { createMemoryHistory } from 'history';
import { renderHook, act } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';

// Mocking online status and navigation
jest.mock('../hooks/useOnlineStatus');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const history = createMemoryHistory();
const store = configureStore(history);

// Mocking useOnlineStatus
let mockIsOnline = true;
jest.mock('../hooks/useOnlineStatus', () => () => mockIsOnline);

// Mocking useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mocking useResponsiveDisplay
jest.mock('../hooks/useResponsiveDisplay', () => () => false);

// Mocking useContext for UserContext
const mockUser = {
  user: {
    tasks: [],
    emojisStyle: {},
    settings: {},
    name: '',
  },
  setUser: jest.fn(),
};

const mockProvider = ({ children }) => (
  <UserContext.Provider value={mockUser}>{children}</UserContext.Provider>
);

// Mocking AnimatedGreeting
jest.mock('../components/AnimatedGreeting', () => () => null);

// Mocking TasksList
jest.mock('../components/tasks/TasksList', () => () => null);

// Mocking showToast
jest.mock('../utils/showToast', () => jest.fn());

// Mocking useResponsiveDisplay
jest.mock('../hooks/useResponsiveDisplay', () => () => false);

// Mocking useOnlineStatus
jest.mock('../hooks/useOnlineStatus', () => () => true);

// Mocking useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mocking useEffect
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

// Mocking useMemo
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn(),
}));

// Mocking Lazy components
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  lazy: (fn) => fn(),
}));

// Mocking Suspense
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  Suspense: ({ fallback, children }) => children,
}));

// Mocking Online Status
setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ user: {} }));
  }),
);

const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Home Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <mockProvider>
              <Home />
            </mockProvider>
          </Router>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with no tasks', () => {
    const mockUserWithoutTasks = {
      user: {
        tasks: [],
        emojisStyle: {},
        settings: {},
        name: '',
      },
      setUser: jest.fn(),
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <mockProvider>
              <Home />
            </mockProvider>
          </Router>
        </Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with one task', () => {
    const mockUserWithOneTask = {
      user: {
        tasks: [
          {
            id: 1,
            name: 'Test Task',
            done: false,
            deadline: '2023-10-10T12:00:00Z',
          },
        ],
        emojisStyle: {},
        settings: {},
        name: '',
      },
      setUser: jest.fn(),
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <mockProvider>
              <Home />
            </mockProvider>
          </Router>
        </Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with multiple tasks', () => {
    const mockUserWithMultipleTasks = {
      user: {
        tasks: [
          {
            id: 1,
            name: 'Task 1',
            done: false,
            deadline: '2023-10-10T12:00:00Z',
          },
          {
            id: 2,
            name: 'Task 2',
            done: true,
            deadline: '2023-10-11T12:00:00Z',
          },
        ],
        emojisStyle: {},
        settings: {},
        name: '',
      },
      setUser: jest.fn(),
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <mockProvider>
              <Home />
            </mockProvider>
          </Router>
        </Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with all tasks completed', () => {
    const mockUserWithAllTasksCompleted = {
      user: {
        tasks: [
          {
            id: 1,
            name: 'Task 1',
            done: true,
            deadline: '2023-10-10T12:00:00Z',
          },
          {
            id: 2,
            name: 'Task 2',
            done: true,
            deadline: '2023-10-11T12:00:00Z',
          },
        ],
        emojisStyle: {},
        settings: {},
        name: '',
      },
      setUser: jest.fn(),
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <mockProvider>
              <Home />
            </mockProvider>
          </Router>
        </Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with tasks due today', () => {
    const mockUserWithTasksDueToday = {
      user: {
        tasks: [
          {
            id: 1,
            name: 'Task 1',
            done: false,
            deadline: '2023-10-10T12:00:00Z',
          },
          {
            id: 2,
            name: 'Task 2',
            done: false,
            deadline: '2023-10-10T12:00:00Z',
          },
        ],
        emojisStyle: {},
        settings: {},
        name: '',
      },
      setUser: jest.fn(),
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <mockProvider>
              <Home />
            </mockProvider>
          </Router>
        </Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with offline status', () => {
    mockIsOnline = false;
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <mockProvider>
              <Home />
            </mockProvider>
          </Router>
        </Provider,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: Home.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Home
// ============================================
Вот пример кода интеграционного теста для компонента `Home`, учитывая предоставленные требования и зависимости:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../contexts/UserContext'; // Предположим, что UserContext доступен здесь
import { Home } from './Home'; // Импортируйте компонент Home из соответствующего пути

// Создайте mock store или используйте реальный state
const initialState = {
  user: {
    tasks: [],
    emojisStyle: {},
    settings: {},
    name: '',
  },
};
const store = createStore(() => initialState);

// Моки для API и контекста
const server = setupServer(
  // Mock API calls here
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.json({ tasks: [] }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Home Integration Tests', () => {
  it('renders correctly with no tasks', async () => {
    render(
      <Provider store={store}>
        <UserContext.Provider value={{ user: initialState.user }}>
          <Home />
        </UserContext.Provider>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(screen.queryByText(/you have 0 tasks to complete/i)).toBeInTheDocument();
  });

  it('renders correctly with tasks', async () => {
    const tasks = [
      { id: 1, name: 'Task 1', done: true },
      { id: 2, name: 'Task 2' },
    ];
    const updatedInitialState = {
      ...initialState,
      user: {
        ...initialState.user,
        tasks,
      },
    };

    render(
      <Provider store={createStore(() => updatedInitialState)}>
        <UserContext.Provider value={{ user: updatedInitialState.user }}>
          <Home />
        </UserContext.Provider>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    expect(screen.queryByText(/you've completed 1 out of 2 tasks/i)).toBeInTheDocument();
  });

  it('displays offline message', async () => {
    render(
      <Provider store={store}>
        <UserContext.Provider value={{ user: initialState.user }}>
          <Home />
        </UserContext.Provider>
      </Provider>,
    );

    userEvent.click(screen.getByTestId('offline-test'));

    await waitFor(() => expect(screen.queryByText(/you're offline/i)).toBeInTheDocument());
  });

  it('updates show progress bar setting', async () => {
    const tasks = [
      { id: 1, name: 'Task 1', done: true },
      { id: 2, name: 'Task 2' },
    ];
    const updatedInitialState = {
      ...initialState,
      user: {
        ...initialState.user,
        tasks,
      },
    };

    render(
      <Provider store={createStore(() => updatedInitialState)}>
        <UserContext.Provider value={{ user: updatedInitialState.user }}>
          <Home />
        </UserContext.Provider>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());

    userEvent.click(screen.getByRole('button', { name: /undo/i }));

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  });
});
### Примечания к коду:
- **MSW**: Используется для мокирования API вызовов (`rest.get()`).
- **Redux**: Используется для создания магазина Redux и передачи его в компонент через провайдер.
- **UserContext**: Передается как провайдер контекста.
- **Тестирование состояний**: Проверяется наличие прогресса барра и отображение сообщений о задачах.
- **Асинхронное ожидание**: Используется `waitFor` для ожидания появления элементов на экране перед проверкой их наличия.

Этот пример демонстрирует базовую структуру интеграционного тестирования компонента `Home`. Вы можете расширить тесты в соответствии с вашими требованиями и особенностями приложения.
