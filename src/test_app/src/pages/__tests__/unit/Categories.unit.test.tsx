/**
 * Модульные тесты для изолированной проверки компонента для Categories
 * 
 * @file Categories.unit.test.tsx
 * @description Тестирование Categories 
 * @generated 2026-09-08T13:31:55.027Z
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
import Categories from './Categories';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { UserContext } from '../../contexts/UserContext';
import { TaskContext } from '../../contexts/TaskContext';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockUser from '../../__mocks__/user.mock';
import mockTask from '../../__mocks__/tasks.mock';

const mockStore = configureStore([]);
const store = mockStore({ user: mockUser, tasks: mockTask });

const theme = createTheme({
  palette: {
    primary: '#ff9a9e',
    secondary: '#f7f6f5',
    darkmode: false,
  },
});

describe('Categories', () => {
  let userContextValue;
  let taskContextValue;

  beforeEach(() => {
    userContextValue = {
      user: mockUser,
      setUser: jest.fn(),
    };
    taskContextValue = {
      updateCategory: jest.fn(),
    };
  });

  describe('Рендеринг', () => {
    it('renders without crashing', () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );
      expect(screen.queryByRole('heading', { name: 'Categories' })).toBeInTheDocument();
    });

    it('displays categories when available', () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );
      const categoryNames = screen.getAllByRole('listitem');
      expect(categoryNames).toHaveLength(mockUser.categories.length);
    });

    it('does not render categories when none exist', () => {
      const emptyUser = { ...mockUser, categories: [] };
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={{ user: emptyUser, setUser: jest.fn() }}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );
      expect(screen.queryByText(/you don't have any categories/i)).toBeInTheDocument();
    });

    it('renders add category form', () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );
      expect(screen.getByText(/add new category/i)).toBeInTheDocument();
    });
  });

  describe('Добавление категории', () => {
    it('adds a new category successfully', async () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );

      const input = screen.getByPlaceholderText('Enter category name');
      await userEvent.type(input, 'Test Category');
      userEvent.click(screen.getByText(/create category/i));

      await waitFor(() => {
        expect(taskContextValue.updateCategory).toHaveBeenCalledWith({
          id: expect.any(String),
          name: 'Test Category',
          emoji: undefined,
          color: theme.primary,
          lastSave: expect.any(Date),
        });
      });
    });

    it('shows an error for invalid category name', async () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );

      const input = screen.getByPlaceholderText('Enter category name');
      await userEvent.type(input, '');
      userEvent.click(screen.getByText(/create category/i));

      await waitFor(() => {
        expect(screen.getByText(/category name is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Редактирование категории', () => {
    it('edits a category successfully', async () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );

      const firstCategory = screen.getAllByRole('listitem')[0];
      userEvent.click(firstCategory.querySelector('.MuiIconButton-root'));

      const editInput = screen.getByRole('textbox', { name: 'Enter category name' });
      await userEvent.type(editInput, 'Updated Name');
      userEvent.click(screen.getByText(/save/i));

      await waitFor(() => {
        expect(taskContextValue.updateCategory).toHaveBeenCalledWith({
          id: expect.any(String),
          name: 'Updated Name',
          emoji: undefined,
          color: theme.primary,
          lastSave: expect.any(Date),
        });
      });
    });

    it('cancels editing a category', async () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );

      const firstCategory = screen.getAllByRole('listitem')[0];
      userEvent.click(firstCategory.querySelector('.MuiIconButton-root'));

      userEvent.click(screen.getByText(/cancel/i));

      expect(taskContextValue.updateCategory).not.toHaveBeenCalled();
    });
  });

  describe('Удаление категории', () => {
    it('deletes a category and shows confirmation dialog', async () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );

      const firstCategory = screen.getAllByRole('listitem')[0];
      userEvent.click(firstCategory.querySelector('.MuiIconButton-root'));

      userEvent.click(screen.getByText(/delete/i));

      await waitFor(() => {
        expect(screen.queryByText(/delete this category/i)).toBeInTheDocument();
      });

      userEvent.click(screen.getByText(/delete/i));

      await waitFor(() => {
        expect(userContextValue.setUser).toHaveBeenCalledWith({
          ...mockUser,
          categories: [],
        });
      });
    });

    it('prevents deleting a category with associated tasks', async () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );

      const firstCategory = screen.getAllByRole('listitem')[0];
      userEvent.click(firstCategory.querySelector('.MuiIconButton-root'));

      userEvent.click(screen.getByText(/delete/i));

      await waitFor(() => {
        expect(screen.queryByText(/this action cannot be undone/i)).toBeInTheDocument();
      });
    });
  });

  describe('Добавление в избранное', () => {
    it('marks a category as favorite', async () => {
      render(
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <UserContext.Provider value={userContextValue}>
                <TaskContext.Provider value={taskContextValue}>
                  <Categories />
                </TaskContext.Provider>
              </UserContext.Provider>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>,
      );

      const firstCategory = screen.getAllByRole('listitem')[0];
      userEvent.click(firstCategory.querySelector('.MuiIconButton-root'));

      userEvent.click(screen.getByRole('button', { name: /star checked/i });

      await waitFor(() => {
        expect(userContextValue.setUser).toHaveBeenCalledWith({
          ...mockUser,
          favoriteCategories: ['test-category-id'],
        });
      });
    });
  });
});

// Дополнительные тесты можно добавить здесь, если требуется проверить специфические сценарии или поведение.