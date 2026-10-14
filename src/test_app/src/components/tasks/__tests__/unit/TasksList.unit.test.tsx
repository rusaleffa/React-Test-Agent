/**
 * Модульные тесты для изолированной проверки компонента для TasksList
 * 
 * @file TasksList.unit.test.tsx
 * @description Тестирование TasksList 
 * @generated 2026-09-08T13:27:43.381Z
 * @type {unit}
 * @testCount 13
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D @testing-library/user-event

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