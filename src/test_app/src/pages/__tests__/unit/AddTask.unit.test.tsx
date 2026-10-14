/**
 * Модульные тесты для изолированной проверки компонента для AddTask
 * 
 * @file AddTask.unit.test.tsx
 * @description Тестирование AddTask 
 * @generated 2026-09-08T13:31:22.659Z
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

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddTask from './AddTask';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { InputThemeProvider } from '../../contexts/InputThemeProvider';
import { CategorySelect } from '../../components/CategorySelect';
import { ColorPicker } from '../../components/ColorPicker';
import { CustomEmojiPicker } from '../../components/CustomEmojiPicker';

const mockUser = {
  settings: {
    enableCategories: true,
  },
  tasks: [],
};

const mockSetUser = jest.fn();

const mockTheme = createTheme({
  palette: {
    primary: '#ff0000',
  },
});

const MockedUserContext = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
    {children}
  </UserContext.Provider>
);

describe('AddTask', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument();
      expect(screen.getByLabelText(/task name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/task description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/task deadline/i)).toBeInTheDocument();
      expect(screen.getByTestId('custom-emoji-picker')).toBeInTheDocument();
      expect(screen.getByTestId('category-select')).toBeInTheDocument();
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
      expect(screen.getByText(/Create Task/i)).toBeInTheDocument();
    });

    it('should render without categories when setting is off', () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      expect(screen.queryByTestId('category-select')).not.toBeInTheDocument();
    });

    it('should display error message when task name is too long', async () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      await userEvent.type(screen.getByLabelText(/task name/i), 'a'.repeat(101));

      expect(screen.getByText('Name should be less than or equal to 100 characters')).toBeInTheDocument();
    });

    it('should display error message when task description is too long', async () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      await userEvent.type(screen.getByLabelText(/task description/i), 'a'.repeat(1001));

      expect(screen.getByText('Description should be less than or equal to 1000 characters')).toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    it('should update state on input change', () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      userEvent.type(screen.getByLabelText(/task name/i), 'test');
      expect(mockUser.tasks[0].name).toEqual('test');

      userEvent.type(screen.getByLabelText(/task description/i), 'test description');
      expect(mockUser.tasks[0].description).toEqual('test description');

      userEvent.type(screen.getByLabelText(/task deadline/i), '2023-10-10T12:00');
      expect(mockUser.tasks[0].deadline).toEqual(new Date('2023-10-10T12:00'));
    });

    it('should clear deadline on click of cancel button', async () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      userEvent.type(screen.getByLabelText(/task deadline/i), '2023-10-10T12:00');
      expect(screen.getByDisplayValue('2023-10-10T12:00').parentNode.querySelectorAll('input').length).toEqual(1);

      userEvent.click(screen.getByRole('button', { name: /clear/i }));
      expect(screen.queryByDisplayValue('2023-10-10T12:00')).not.toBeInTheDocument();
    });

    it('should call handleAddTask on submit', async () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      userEvent.type(screen.getByLabelText(/task name/i), 'test');
      userEvent.type(screen.getByLabelText(/task description/i), 'test description');
      userEvent.type(screen.getByLabelText(/task deadline/i), '2023-10-10T12:00');

      await userEvent.click(screen.getByText(/Create Task/i));

      expect(mockSetUser.mock.calls.length).toBe(1);
    });
  });

  describe('Вспомогательные функции', () => {
    it('should validate task name and description lengths', () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      userEvent.type(screen.getByLabelText(/task name/i), 'a'.repeat(TASK_NAME_MAX_LENGTH + 1));
      expect(screen.getByText('Name should be less than or equal to 100 characters')).toBeInTheDocument();

      userEvent.type(screen.getByLabelText(/task description/i), 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1));
      expect(screen.getByText('Description should be less than or equal to 1000 characters')).toBeInTheDocument();
    });
  });

  describe('Взаимодействие с дочерними компонентами', () => {
    it('should pass correct prop to custom emoji picker', () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('custom-emoji-picker').props.emoji).toBe(null);
    });

    it('should pass correct prop to category select', () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('category-select').props.selectedCategories).toEqual([]);
    });

    it('should pass correct prop to color picker', () => {
      render(
        <MemoryRouter>
          <MockedUserContext>
            <ThemeProvider theme={mockTheme}>
              <InputThemeProvider>
                <AddTask />
              </InputThemeProvider>
            </ThemeProvider>
          </MockedUserContext>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('color-picker').props.color).toBe('#ff0000');
    });
  });
});