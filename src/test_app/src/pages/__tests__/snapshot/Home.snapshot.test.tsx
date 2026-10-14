/**
 * Snapshot-тесты для проверки рендеринга для Home
 * 
 * @file Home.snapshot.test.tsx
 * @description Тестирование Home 
 * @generated 2026-09-08T13:32:37.411Z
 * @type {snapshot}
 * @testCount 7
 * 
 * @dependencies @testing-library/react, react-test-renderer
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D react-test-renderer

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