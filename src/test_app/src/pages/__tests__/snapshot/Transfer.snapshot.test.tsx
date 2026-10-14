/**
 * Snapshot-тесты для проверки рендеринга для Transfer
 * 
 * @file Transfer.snapshot.test.tsx
 * @description Тестирование Transfer 
 * @generated 2026-09-08T13:35:49.928Z
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
import { UserContext } from '../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';
import Transfer from './Transfer';

// Mock context values
const mockUser = {
  createdAt: Date.now(),
  emojisStyle: {},
  tasks: [
    {
      id: 'task1',
      name: 'Test Task',
      description: 'This is a test task',
      category: ['test-cat'],
      color: '#ff0000',
      emoji: '',
    },
  ],
  categories: [
    {
      id: 'cat1',
      name: 'test-cat',
      color: '#00ff00',
    },
  ],
};

const mockSetUser = jest.fn();

const mockContextValues = {
  user: mockUser,
  setUser: mockSetUser,
};

describe('Transfer Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={mockContextValues}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with no tasks', () => {
    const mockUserWithoutTasks = {
      ...mockUser,
      tasks: [],
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserWithoutTasks }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with multiple tasks', () => {
    const mockUserWithMultipleTasks = {
      ...mockUser,
      tasks: [
        {
          id: 'task1',
          name: 'Test Task',
          description: 'This is a test task',
          category: ['test-cat'],
          color: '#ff0000',
          emoji: '',
        },
        {
          id: 'task2',
          name: 'Another Test Task',
          description: 'This is another test task',
          category: ['another-cat'],
          color: '#00ff00',
          emoji: '',
        },
      ],
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserWithMultipleTasks }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with selected tasks', () => {
    const mockUserWithSelectedTasks = {
      ...mockUser,
      tasks: [
        {
          id: 'task1',
          name: 'Test Task',
          description: 'This is a test task',
          category: ['test-cat'],
          color: '#ff0000',
          emoji: '',
        },
        {
          id: 'task2',
          name: 'Another Test Task',
          description: 'This is another test task',
          category: ['another-cat'],
          color: '#00ff00',
          emoji: '',
        },
      ],
      selectedTasks: ['task1'],
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserWithSelectedTasks }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with empty selected tasks', () => {
    const mockUserWithEmptySelectedTasks = {
      ...mockUser,
      tasks: [
        {
          id: 'task1',
          name: 'Test Task',
          description: 'This is a test task',
          category: ['test-cat'],
          color: '#ff0000',
          emoji: '',
        },
        {
          id: 'task2',
          name: 'Another Test Task',
          description: 'This is another test task',
          category: ['another-cat'],
          color: '#00ff00',
          emoji: '',
        },
      ],
      selectedTasks: [],
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserWithEmptySelectedTasks }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with loading state', () => {
    const mockUserLoading = {
      ...mockUser,
      loading: true,
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserLoading }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with error state', () => {
    const mockUserError = {
      ...mockUser,
      error: 'An error occurred while fetching data.',
    };
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={{ ...mockContextValues, user: mockUserError }}>
            <Transfer />
          </UserContext.Provider>
        </MemoryRouter,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});