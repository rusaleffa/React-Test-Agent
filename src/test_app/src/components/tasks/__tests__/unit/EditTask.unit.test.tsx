/**
 * Модульные тесты для изолированной проверки компонента для EditTask
 * 
 * @file EditTask.unit.test.tsx
 * @description Тестирование EditTask 
 * @generated 2026-09-08T13:24:12.661Z
 * @type {unit}
 * @testCount 15
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
import EditTask from '../EditTask';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { Task } from '../../types/user';
import { createMemoryContext } from '../../__mocks__/createMemoryContext';

const mockTask: Task = {
  id: 'test-task-id',
  name: 'Test Task Name',
  description: 'This is a test task description.',
  color: '#ff0000',
  emoji: ':smile:',
  category: ['Work'],
  deadline: new Date().toISOString(),
  lastSave: new Date().toISOString(),
};

const mockUser = {
  tasks: [mockTask],
  settings: {
    enableCategories: true,
  },
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
    {children}
  </UserContext.Provider>
);

describe('EditTask', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/Edit Task/i)).toBeInTheDocument();
      expect(screen.getByText(mockTask.name)).toBeInTheDocument();
      expect(screen.getByText(mockTask.description)).toBeInTheDocument();
      expect(screen.getByText(/Last edited/i)).toBeInTheDocument();
    });

    it('should render without task prop', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.queryByText(mockTask.name)).not.toBeInTheDocument();
      expect(screen.queryByText(mockTask.description)).not.toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    let component;

    beforeEach(() => {
      component = render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );
    });

    it('should update name field on change', async () => {
      await userEvent.type(component.getByLabelText(/Name/i), 'New Test Task');

      expect(component.getByDisplayValue('New Test Task')).toBeInTheDocument();
    });

    it('should update description field on change', async () => {
      await userEvent.type(component.getByLabelText(/Description/i), 'This is a new test description.');

      expect(component.getByDisplayValue('This is a new test description.')).toBeInTheDocument();
    });

    it('should clear deadline on click', async () => {
      const button = screen.getByRole('button', { name: /clear/i });
      await userEvent.click(button);

      expect(component.getByDisplayValue('')).toBeInTheDocument();
    });

    it('should save task on click', async () => {
      const saveButton = screen.getByRole('button', { name: /save/i });
      await userEvent.click(saveButton);

      expect(component.container).toHaveClass('MuiDialog-paper--exit');
    });

    it('should cancel task on click', async () => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      expect(component.container).toHaveClass('MuiDialog-paper--exit');
    });
  });

  describe('Вспомогательные функции', () => {
    it('should call onClose function on close', () => {
      const onCloseSpy = jest.fn();
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={onCloseSpy} />
          </MockUserContext>
        </MemoryRouter>
      );

      userEvent.click(screen.getByRole('button', { name: /close/i }));

      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('should update categories', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      const select = screen.getByRole('combobox', { name: /category/i });
      userEvent.selectOptions(select, ['Home']);

      expect(screen.getAllByText(/Home/i)).toHaveLength(1);
    });
  });

  describe('Проверки на ошибки', () => {
    it('should show error for empty name', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={{ ...mockTask, name: '' }} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });

    it('should show error for long name', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={{ ...mockTask, name: 'a'.repeat(TASK_NAME_MAX_LENGTH + 1) }} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/Name is too long/i)).toBeInTheDocument();
    });

    it('should show error for long description', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={{ ...mockTask, description: 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1) }} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/Description is too long/i)).toBeInTheDocument();
    });
  });

  describe('Редактирование категории', () => {
    it('should update selected categories', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      const select = screen.getByRole('combobox', { name: /category/i });
      userEvent.selectOptions(select, ['Work', 'Personal']);

      expect(screen.getAllByText(/Work/i)).toHaveLength(1);
      expect(screen.getAllByText(/Personal/i)).toHaveLength(1);
    });
  });

  describe('Тестирование взаимодействия с дочерними компонентами', () => {
    it('should pass correct props to EmojiPicker', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MockUserContext>
        </MemoryRouter>
      );

      const emojiPicker = screen.getByRole('dialog', { name: /custom emoji picker/i });
      expect(emojiPicker).toBeInTheDocument();
    });

    it('should pass correct props to CategorySelect', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <EditTask open task={mockTask} onClose={() => {}} />
          </MemoryRouter>
        </MockUserContext>
      );

      const categorySelect = screen.getByRole('combobox', { name: /category/i });
      expect(categorySelect).toBeInTheDocument();
    });
  });
});

// Создание мока контекста пользователя
const createMemoryContext = createMemoryContext(UserContext);