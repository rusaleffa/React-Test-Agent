/**
 * Модульные тесты для изолированной проверки компонента для Purge
 * 
 * @file Purge.unit.test.tsx
 * @description Тестирование Purge 
 * @generated 2026-09-08T13:33:26.972Z
 * @type {unit}
 * @testCount 7
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
import Purge from '../Purge';
import { UserContext } from '../contexts/UserContext';
import { Task, UUID } from '../types/user';
import { useStorageState } from '../hooks/useStorageState';

jest.mock('../hooks/useStorageState');

const mockUser = {
  tasks: [
    { id: 'task1', name: 'Task 1', done: true },
    { id: 'task2', name: 'Task 2', done: false },
    { id: 'task3', name: 'Task 3', done: true },
  ],
  deletedTasks: ['task4'],
};

const mockSetUser = jest.fn();

useStorageState.mockImplementation((initialValue, key, storageType) => {
  return {
    value: initialValue,
    set: jest.fn(),
  };
});

describe('Purge', () => {
  beforeEach(() => {
    useStorageState.mockClear();
    mockSetUser.mockClear();
  });

  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      expect(screen.getByText(/Purge Tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/Select Tasks To Purge/i)).toBeInTheDocument();
      expect(screen.queryByText(/You don't have any tasks to purge/i)).not.toBeInTheDocument();

      const doneTasks = screen.getByText(/Done Tasks/i);
      expect(doneTasks).toBeInTheDocument();

      const notDoneTasks = screen.getByText(/Not Done Tasks/i);
      expect(notDoneTasks).toBeInTheDocument();

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Purge Selected/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Purge Done/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Purge All Tasks/i })).toBeInTheDocument();
    });

    it('should render without tasks when no tasks are available', () => {
      const emptyUser = {
        tasks: [],
        deletedTasks: [],
      };

      render(
        <UserContext.Provider value={{ user: emptyUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      expect(screen.getByText(/You don't have any tasks to purge/i)).toBeInTheDocument();
    });

    it('should render tasks correctly', () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const doneTasks = screen.getByText(/Done Tasks/i);
      expect(doneTasks).toContainHTML('<li>Task 1</li>');
      expect(doneTasks).toContainHTML('<li>Task 3</li>');

      const notDoneTasks = screen.getByText(/Not Done Tasks/i);
      expect(notDoneTasks).toContainHTML('<li>Task 2</li>');
    });
  });

  describe('Обработка событий', () => {
    it('should select and deselect tasks', async () => {
      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const task1Checkbox = screen.getByRole('checkbox', { name: /Task 1/i });
      await userEvent.click(task1Checkbox);

      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        tasks: [
          { id: 'task1', name: 'Task 1', done: true },
          { id: 'task2', name: 'Task 2', done: false },
          { id: 'task3', name: 'Task 3', done: true },
        ],
        deletedTasks: ['task4'],
        tasksToPurge: ['task1'],
      });

      await userEvent.click(task1Checkbox);
      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        tasks: [
          { id: 'task1', name: 'Task 1', done: true },
          { id: 'task2', name: 'Task 2', done: false },
          { id: 'task3', name: 'Task 3', done: true },
        ],
        deletedTasks: ['task4'],
        tasksToPurge: [],
      });
    });

    it('should purge selected tasks', async () => {
      useStorageState.mockImplementationOnce(() => ({ value: [], set: jest.fn() }));

      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const task1Checkbox = screen.getByRole('checkbox', { name: /Task 1/i });
      await userEvent.click(task1Checkbox);

      const purgeSelectedButton = screen.getByRole('button', { name: /Purge Selected/i });
      await userEvent.click(purgeSelectedButton);

      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        tasks: [
          { id: 'task2', name: 'Task 2', done: false },
          { id: 'task3', name: 'Task 3', done: true },
        ],
        deletedTasks: ['task4', 'task1'],
        tasksToPurge: [],
      });
    });

    it('should purge done tasks', async () => {
      useStorageState.mockImplementationOnce(() => ({ value: [], set: jest.fn() }));

      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const purgeDoneButton = screen.getByRole('button', { name: /Purge Done/i });
      await userEvent.click(purgeDoneButton);

      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        tasks: [{ id: 'task2', name: 'Task 2', done: false }],
        deletedTasks: ['task4', 'task1', 'task3'],
        tasksToPurge: [],
      });
    });

    it('should confirm and purge all tasks', async () => {
      useStorageState.mockImplementationOnce(() => ({ value: [], set: jest.fn() }));

      render(
        <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          <Purge />
        </UserContext.Provider>,
      );

      const purgeAllButton = screen.getByRole('button', { name: /Purge All Tasks/i });
      await userEvent.click(purgeAllButton);

      const dialog = screen.getByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());

      const confirmButton = screen.getByRole('button', { name: /Purge/i });
      await userEvent.click(confirmButton);

      expect(mockSetUser).toHaveBeenCalledWith({ tasks: [], deletedTasks: ['task1', 'task2', 'task3'] });
    });
  });
});

// Дополнительные моки или настройки можно добавить здесь, если потребуется