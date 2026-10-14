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

// ============================================
// SNAPSHOT TESTS
// Файл: Categories.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Categories
// ============================================
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import Categories from './Categories'; // Импортируйте ваш компонент здесь

// Пример создания снапшотов с различными сценариями и состояниями компонента

describe('Categories Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when adding a new category', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(CategoryInput)
      .props.onChange({ target: { value: 'New Category' } });
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  test('should match snapshot when editing an existing category', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(EditNameInput)
      .props.onChange({ target: { value: 'Updated Name' } });
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  test('should match snapshot when deleting a category', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(Dialog)
      .props.onClick(); // Имитация клика на кнопку удаления категории
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  test('should match snapshot when showing associated tasks in delete dialog', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(AssociatedTasksAccordion); // Имитация отображения связанных задач в диалоге удаления
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  test('should match snapshot when adding to favorites', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Categories />
        </MemoryRouter>
      )
      .root
      .findByType(CustomDialogTitle)
      .props.onClick(); // Имитация добавления категории в избранное
    expect(renderer.create(<Categories />).toJSON()).toMatchSnapshot();
  });

  // Добавьте дополнительные тесты для других состояний и сценариев работы вашего компонента
});

// ============================================
// INTEGRATION TESTS
// Файл: Categories.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Categories
// ============================================
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as ContextProvider } from '../contexts/UserContext'; // Предположим, что это правильный путь к провайдеру контекста
import { TaskContextProvider } from '../contexts/TaskContext'; // Аналогично для TaskContext
import Categories from './Categories'; // Импортируйте компонент Categories здесь

// Моки сервер API
const server = setupServer(
  // Пример моков API
  rest.get('/api/categories', (req, res, ctx) => {
    return res(ctx.json([
      {
        id: 'cat1',
        name: 'Category One',
        emoji: ':smile:',
        color: '#ff0000'
      },
      {
        id: 'cat2',
        name: 'Category Two',
        emoji: ':heart:',
        color: '#00ff00'
      }
    ]))
  }),
  
  // Добавьте другие необходимые моки API здесь...
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Categories Integration Tests', () => {
  it('should load and display categories correctly', async () => {
    render(
      <ContextProvider>
        <TaskContextProvider>
          <Categories />
        </TaskContextProvider>
      </ContextProvider>
    );

    await waitFor(() => expect(screen.queryByRole('heading', { level: 2, name: 'Categories' })).toBeInTheDocument());
    
    // Проверка отображения категорий
    expect(screen.getAllByRole('listitem')).toHaveLength(2); // Убедитесь, что загружено две категории
    expect(screen.getByText(/Category One/i)).toBeInTheDocument(); // Проверка первой категории
    expect(screen.getByText(/Category Two/i)).toBeInTheDocument(); // Проверка второй категории
  });

  it('should allow adding a new category', async () => {
    render(
      <ContextProvider>
        <TaskContextProvider>
          <Categories />
        </TaskContextProvider>
      </ContextProvider>
    );

    // Нажмите кнопку добавления новой категории
    userEvent.click(screen.getByText('Add New Category'));

    // Введите данные для новой категории
    userEvent.type(screen.getByPlaceholderText('Enter category name'), 'New Category');
    userEvent.click(screen.getByText('Create Category'));

    // Ожидание появления сообщения о добавлении категории
    await waitFor(() => expect(screen.getByText('Added category - New Category')).toBeInTheDocument());
  });

  it('should allow editing an existing category', async () {
    render(
      <ContextProvider>
        <TaskContextProvider>
          <Categories />
        </TaskContextProvider>
      </ContextProvider>
    );

    // Найдите категорию для редактирования
    const categoryItem = screen.getByText(/Category One/i);

    // Откройте диалоговое окно редактирования
    userEvent.click(screen.getByRole('button', { name: /Edit/i }, within: categoryItem));

    // Измените имя категории и сохраните изменения
    userEvent.clear(screen.getByRole('textbox', { name: /Enter category name/i }));
    userEvent.type(screen.getByRole('textbox', { name: /Enter category name/i }), 'Updated Name');
    userEvent.click(screen.getByText('Save'));

    // Ожидание появления сообщения об обновлении категории
    await waitFor(() => expect(screen.getByText('Updated category - Updated Name')).toBeInTheDocument());
  });

  it('should allow deleting a category with associated tasks', async () {
    render(
      <ContextProvider>
        <TaskContextProvider>
          <Categories />
        </TaskContextProvider>
      </ContextProvider>
    );

    // Найдите категорию для удаления
    const categoryItem = screen.getByText(/Category One/i);

    // Откройте диалог удаления
    userEvent.click(screen.getByRole('button', { name: /Delete/i }, within: categoryItem));

    // Подтвердите удаление
    userEvent.click(screen.getByText('Delete'));

    // Ожидание появления сообщения о удалении категории
    await waitFor(() => expect(screen.getByText('Deleted category - Category One')).toBeInTheDocument());
  });

  it('should allow deleting a category without associated tasks', async () {
    render(
      <ContextProvider>
        <TaskContextProvider>
          <Categories />
        </TaskContextProvider>
      </ContextProvider>
    );

    // Найдите вторую категорию (без задач), чтобы удалить её
    const secondCategoryItem = screen.getByText(/Category Two/i);

    // Откройте диалог удаления
    userEvent.click(screen.getByRole('button', { name: /Delete/i }, within: secondCategoryItem));

    // Подтвердите удаление
    userEvent.click(screen.getByText('Delete'));

    // Ожидание появления сообщения о удалении категории
    await waitFor(() => expect(screen.getByText('Deleted category - Category Two')).toBeInTheDocument());
  });
});
Этот пример демонстрирует базовую структуру интеграционного теста для компонента `Categories`. Он включает в себя настройку моков API, проверку основных функциональных возможностей, таких как загрузка данных, создание, обновление и удаление категорий. Обратите внимание на использование библиотеки `@testing-library/user-event`, которая позволяет имитировать пользовательские действия более естественно, чем стандартные методы `fireEvent`.

В реальных сценариях вам может понадобиться добавить дополнительные проверки состояний, ошибок или асинхронных операций, используя соответствующие инструменты из экосистемы тестирования React.
