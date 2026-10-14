/**
 * Snapshot-тесты для проверки рендеринга для TaskMenu
 * 
 * @file TaskMenu.snapshot.test.tsx
 * @description Тестирование TaskMenu 
 * @generated 2026-09-08T13:26:28.559Z
 * @type {snapshot}
 * @testCount 10
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