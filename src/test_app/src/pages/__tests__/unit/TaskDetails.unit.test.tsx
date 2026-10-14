/**
 * Модульные тесты для изолированной проверки компонента для TaskDetails
 * 
 * @file TaskDetails.unit.test.tsx
 * @description Тестирование TaskDetails 
 * @generated 2026-09-08T13:35:08.966Z
 * @type {unit}
 * @testCount 5
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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskDetails from '../TaskDetails';
import { UserContext } from '../contexts/UserContext';
import NotFound from './NotFound';

// Моки для дочерних компонентов (если нужно)
jest.mock('@mui/icons-material');
jest.mock('emoji-picker-react');
jest.mock('ntc-ts');

const mockUser = {
  tasks: [
    {
      id: '1',
      name: 'Test Task',
      description: 'This is a test task',
      color: '#ff0000',
      date: '2023-09-01T12:00:00Z',
      lastSave: '2023-09-02T12:00:00Z',
      deadline: '2023-09-03T12:00:00Z',
      done: true,
      pinned: false,
      sharedBy: 'John Doe',
      category: ['Category A'],
      emoji: ':smile:'
    }
  ],
  emojisStyle: {}
};

const mockGetColorName = jest.fn();

describe('TaskDetails', () => {
  beforeEach(() => {
    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <TaskDetails />
      </UserContext.Provider>
    );
  });

  describe('Рендеринг', () => {
    it('should render without errors', () => {
      expect(screen.queryByRole('heading')).toBeInTheDocument();
      expect(screen.queryByText(/Task Details/i)).toBeInTheDocument();
      expect(screen.queryByText(/Task:/)).toBeInTheDocument();
      expect(screen.queryByText(/Test Task/i)).toBeInTheDocument();
      expect(screen.queryByText(/Description:/)).toBeInTheDocument();
      expect(screen.queryByText(/This is a test task/i)).toBeInTheDocument();
      expect(screen.queryByText(/Color:/)).toBeInTheDocument();
      expect(screen.queryByText(/#FF0000/i)).toBeInTheDocument();
      expect(screen.queryByText(/Created:/)).toBeInTheDocument();
      expect(screen.queryByText(/2023-09-01/i)).toBeInTheDocument();
      expect(screen.queryByText(/Last edited:/)).toBeInTheDocument();
      expect(screen.queryByText(/2023-09-02/i)).toBeInTheDocument();
      expect(screen.queryByText(/Task deadline:/)).toBeInTheDocument();
      expect(screen.queryByText(/2023-09-03/i)).toBeInTheDocument();
      expect(screen.queryByText(/Done:/)).toBeInTheDocument();
      expect(screen.queryByText(/✅/)).toBeInTheDocument();
      expect(screen.queryByText(/Pinned:/)).toBeInTheDocument();
      expect(screen.queryByText(/❌/)).toBeInTheDocument();
      expect(screen.queryByText(/Shared by:/)).toBeInTheDocument();
      expect(screen.queryByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.queryByText(/Categories:/)).toBeInTheDocument();
      expect(screen.queryByText(/Category A/i)).toBeInTheDocument();
      expect(screen.queryByText(/Emoji:/)).toBeInTheDocument();
      expect(screen.queryByText(/😊/)).toBeInTheDocument();
    });

    it('should show not found page when task not found', () => {
      render(
        <UserContext.Provider value={{ user: { tasks: [] } }}>
          <TaskDetails />
        </UserContext.Provider>
      );
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      expect(screen.queryByText(/Task with id /i)).toBeInTheDocument();
      expect(screen.queryByText(/was not found./i)).toBeInTheDocument();
    });
  });

  describe('Обработка данных', () => {
    it('should format the date correctly', () => {
      const dateFormatterMock = new Intl.DateTimeFormat(navigator.language, {
        dateStyle: 'full',
        timeStyle: 'short'
      });
      dateFormatterMock.format.mockReturnValue('September 1st, 2023');
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskDetails />
        </UserContext.Provider>
      );
      expect(dateFormatterMock.format).toHaveBeenCalledWith(new Date(mockUser.tasks[0].date));
      expect(screen.queryByText(/September 1st, 2023/i)).toBeInTheDocument();
    });

    it('should handle missing data gracefully', () => {
      const mockUserWithoutDate = {
        tasks: [
          {
            id: '1',
            name: 'Test Task',
            description: 'This is a test task',
            color: '#ff0000',
            lastSave: null,
            deadline: null,
            done: true,
            pinned: false,
            sharedBy: 'John Doe',
            category: ['Category A'],
            emoji: ':smile:'
          }
        ]
      };
      render(
        <UserContext.Provider value={{ user: mockUserWithoutDate }}>
          <TaskDetails />
        </UserContext.Provider>
      );
      expect(screen.queryByText(/Last edited:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Task deadline:/i)).not.toBeInTheDocument();
    });
  });

  describe('Вспомогательные функции', () => {
    it('should call getColorName once', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskDetails />
        </UserContext.Provider>
      );
      expect(mockGetColorName).toHaveBeenCalledTimes(1);
    });
  });
});

// Дополнительные моки или настройки можно добавить здесь