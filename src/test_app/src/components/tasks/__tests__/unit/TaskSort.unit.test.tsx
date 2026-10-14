/**
 * Модульные тесты для изолированной проверки компонента для TaskSort
 * 
 * @file TaskSort.unit.test.tsx
 * @description Тестирование TaskSort 
 * @generated 2026-09-08T13:26:51.803Z
 * @type {unit}
 * @testCount 6
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
import TaskSort from '../TaskSort';
import { TaskContext } from '../../contexts/TaskContext';
import { MemoryRouter } from 'react-router-dom';

describe('TaskSort', () => {
  let taskContext;

  beforeEach(() => {
    taskContext = {
      sortOption: 'dateCreated',
      setSortOption: jest.fn(),
      sortAnchorEl: null,
      setSortAnchorEl: jest.fn(),
      moveMode: false,
    };
  });

  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <MemoryRouter>
          <TaskContext.Provider value={taskContext}>
            <TaskSort />
          </TaskContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should show menu when clicked', async () => {
      render(
        <MemoryRouter>
          <TaskContext.Provider value={taskContext}>
            <TaskSort />
          </TaskContext.Provider>
        </MemoryRouter>
      );

      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should close menu after selection', async () => {
      render(
        <MemoryRouter>
          <TaskContext.Provider value={taskContext}>
            <TaskSort />
          </TaskContext.Provider>
        </MemoryRouter>
      );

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByText(/Due Date/i));

      expect(taskContext.setSortOption).toHaveBeenCalledWith('dueDate');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should not allow sorting in move mode', () => {
      taskContext.moveMode = true;

      render(
        <MemoryRouter>
          <TaskContext.Provider value={taskContext}>
            <TaskSort />
          </TaskContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByRole('button').disabled).toEqual(true);
    });
  });

  describe('Обработка событий', () => {
    it('should update state on click', async () => {
      render(
        <MemoryRouter>
          <TaskContext.Provider value={taskContext}>
            <TaskSort />
          </TaskContext.Provider>
        </MemoryRouter>
      );

      await userEvent.click(screen.getByRole('button'));
      await userEvent.click(screen.getByText(/Due Date/i));

      expect(taskContext.setSortOption).toHaveBeenCalledWith('dueDate');
    });
  });

  describe('Контекстные зависимости', () => {
    it('should pass context values to component', () => {
      render(
        <MemoryRouter>
          <TaskContext.Provider value={taskContext}>
            <TaskSort />
          </TaskContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});

// Дополнительный моки для дочерних компонентов можно добавить здесь, если потребуется