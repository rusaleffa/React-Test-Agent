/**
 * Модульные тесты для изолированной проверки компонента для TaskItem
 * 
 * @file TaskItem.unit.test.tsx
 * @description Тестирование TaskItem 
 * @generated 2026-09-08T13:25:44.626Z
 * @type {unit}
 * @testCount 12
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
import TaskItem from '../TaskItem';
import { Task } from '../../types/user';
import { UserContext } from '../../contexts/UserContext';
import { TaskContext } from '../../contexts/TaskContext';
import { useSortable } from '@dnd-kit/sortable';

const mockTask = {
  id: 'mock-id',
  name: 'Mock Task',
  date: new Date(),
  deadline: new Date(),
  sharedBy: 'User',
  category: ['category1'],
  color: '#ff0000',
  done: false,
};

const mockUser = {
  settings: {
    enableGlow: true,
  },
};

const mockTaskContext = {
  moveMode: false,
};

const MockComponent = () => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: 'mock-id' });
  return (
    <div
      ref={(node) => setNodeRef(node)}
      {...attributes}
      {...listeners}
      style={{
        transform: `translate(${transform.x}, ${transform.y})`,
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    />
  );
};

describe('TaskItem', () => {
  describe('Рендеринг', () => {
    it('should render without crashing', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByTestId('task-container')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getAllByRole('checkbox').length).toEqual(1);
      expect(screen.getByText(mockTask.name)).toBeInTheDocument();
      expect(screen.getByText(formatDate(mockTask.date))).toBeInTheDocument();
      expect(screen.queryByText('Pinned')).not.toBeInTheDocument();
      expect(screen.queryByText('Shared by User')).toBeInTheDocument();
      expect(screen.queryByText('Ring Alarm')).not.toBeInTheDocument();
    });

    it('should render with pinned task', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={{ ...mockTask, pinned: true }} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByText('Pinned')).toBeInTheDocument();
    });

    it('should render with shared by other user', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={{ ...mockTask, sharedBy: 'Other User' }} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByText('Shared by Other User')).toBeInTheDocument();
    });

    it('should render with completed task', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={{ ...mockTask, done: true }} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByRole('checkbox')).toHaveAttribute('checked');
      expect(screen.getByText('DoneRounded')).toBeInTheDocument();
    });

    it('should render with custom text highlighter', () => {
      const mockTextHighlighter = jest.fn(() => <strong>Highlighted Text</strong>);
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} textHighlighter={mockTextHighlighter} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(mockTextHighlighter).toHaveBeenCalledWith(mockTask.name);
      expect(screen.getByText('Highlighted Text')).toBeInTheDocument();
    });

    it('should render with links enabled', () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} features={{ enableLinks: true }} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByText('Link')).toBeInTheDocument();
    });

    it('should render with draggable handle when in move mode', () => {
      const mockTaskContext = {
        moveMode: true,
      };
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    it('should call onSelect and onDeselect handlers', () => {
      const onSelectSpy = jest.fn();
      const onDeselectSpy = jest.fn();
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem
              task={mockTask}
              selection={{ onSelect: onSelectSpy, onDeselect: onDeselectSpy }}
            />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      userEvent.click(screen.getByRole('checkbox'));
      expect(onSelectSpy).toHaveBeenCalledWith(mockTask.id);
      userEvent.click(screen.getByRole('checkbox'));
      expect(onDeselectSpy).toHaveBeenCalledWith(mockTask.id);
    });

    it('should update state when checkbox is clicked', async () => {
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      userEvent.click(screen.getByRole('checkbox'));
      await waitFor(() => expect(screen.getByRole('checkbox')).toHaveAttribute('checked'));
    });
  });

  describe('Вспомогательные функции', () => {
    it('should format date correctly', () => {
      const formattedDate = formatDate(new Date());
      expect(formattedDate).toMatch(/^\w{3}\s\d{2},\s\d{4}$/); // Пример формата: Mon 27, 2023
    });
  });

  describe('Дочерние компоненты', () => {
    it('should pass correct props to child components', () => {
      const mockChildComponent = () => <MockComponent />;
      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <TaskContext.Provider value={mockTaskContext}>
            <TaskItem task={mockTask} children={<mockChildComponent />} />
          </TaskContext.Provider>
        </UserContext.Provider>,
      );
      expect(screen.getByRole('button')).toBeInTheDocument(); // Проверяем наличие дочернего компонента
    });
  });
});

// Дополнительные моки или настройки можно добавить здесь, если потребуется