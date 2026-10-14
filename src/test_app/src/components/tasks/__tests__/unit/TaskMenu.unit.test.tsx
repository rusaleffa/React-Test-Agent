/**
 * Модульные тесты для изолированной проверки компонента для TaskMenu
 * 
 * @file TaskMenu.unit.test.tsx
 * @description Тестирование TaskMenu 
 * @generated 2026-09-08T13:26:28.558Z
 * @type {unit}
 * @testCount 11
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