/**
 * Snapshot-тесты для проверки рендеринга для TasksList
 * 
 * @file TasksList.snapshot.test.tsx
 * @description Тестирование TasksList 
 * @generated 2026-09-08T13:27:43.383Z
 * @type {snapshot}
 * @testCount 9
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