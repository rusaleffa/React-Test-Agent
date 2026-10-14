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

// ============================================
// SNAPSHOT TESTS
// Файл: AddTask.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для AddTask
// ============================================
import renderer from 'react-test-renderer';
import AddTask from './AddTask';

describe('AddTask Snapshot Tests', () => {
  describe('Default Props and States', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<AddTask />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('States: Loading', () => {
    test('should match loading state snapshot', () => {
      const tree = renderer.create(<AddTask loading={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('States: Error', () => {
    test('should match error state snapshot', () => {
      const tree = renderer.create(<AddTask error={"An error occurred"} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('States: Data', () => {
    test('should match data state snapshot', () => {
      const tree = renderer.create(<AddTask data={{ name: "Test Task", description: "Test Description" }} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Prop Variations', () => {
    test('should match snapshot with different prop variations', () => {
      const tree = renderer.create(<AddTask 
        name="Test Task" 
        description="Test Description" 
        emoji="😊" 
        color="#FF5733" 
        deadline="2023-10-10T12:00:00" 
        categories={[{id: "cat1", name: "Category 1"}, {id: "cat2", name: "Category 2"}]}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: AddTask.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для AddTask
// ============================================
Ниже приведен пример кода интеграционного тестирования компонента `AddTask` с учетом всех зависимостей и требований к структуре тестов:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddTask } from './AddTask'; // импортируйте компонент AddTask из соответствующего пути
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { Provider as UserContextProvider } from '../contexts/UserContext';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { InputThemeProvider } from '../contexts/InputThemeProvider';

// Создайте сервер MSW для мокирования API
const server = setupServer(
  // Моки API здесь, если они необходимы
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Настройте тему MUI
const theme = createTheme({
  palette: {
    primary: '#ff9800',
    secondary: '#3f51b5',
  },
});

// Описание теста
describe('AddTask Integration Tests', () => {
  it('Should successfully submit a valid task', async () => {
    render(
      <MemoryRouter initialEntries={['/add-task']}>
        <BrowserRouter>
          <UserContextProvider>
            <ThemeProvider theme={theme}>
              <InputThemeProvider>
                <UserContext.Provider value={{ user: {}, setUser: jest.fn() }}>
                  <AddTask />
                </UserContext.Provider>
              </InputThemeProvider>
            </ThemeProvider>
          </UserContextProvider>
        </BrowserRouter>
      </MemoryRouter>
    );

    // Ввод данных в поля формы
    await userEvent.type(screen.getByLabelText(/task name/i), 'Test Task');
    await userEvent.type(screen.getByLabelText(/task description/i), 'This is a test task description.');
    await userEvent.type(screen.getByLabelText(/task deadline/i), '2023-10-10T12:00');

    // Нажмите кнопку создания задачи
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Подождите завершения асинхронной операции
    await waitFor(() => expect(screen.queryByText(/Added task/i)).not.toBeNull());

    // Проверьте успешное отображение сообщения о добавлении задачи
    expect(screen.getByText(/Added task/i).closest('div')).toHaveClass('success-message');
  });

  it('Should display validation errors when fields are invalid', async () => {
    render(
      <MemoryRouter initialEntries={['/add-task']}>
        <BrowserRouter>
          <UserContextProvider>
            <ThemeProvider theme={theme}>
              <InputThemeProvider>
                <UserContext.Provider value={{ user: {}, setUser: jest.fn() }}>
                  <AddTask />
                </UserContext.Provider>
              </InputThemeProvider>
            </ThemeProvider>
          </UserContextProvider>
        </BrowserRouter>
      </MemoryRouter>
    );

    // Оставьте поле имени пустым
    await userEvent.type(screen.getByLabelText(/task name/i), '');

    // Нажмите кнопку создания задачи
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Подождите завершения асинхронной операции
    await waitFor(() => expect(screen.getByText(/Task name is required./i)).toBeInTheDocument());

    // Проверьте наличие сообщения об ошибке
    expect(screen.getByText(/Task name is required./i)).toBeInTheDocument();
  });
});
Этот пример демонстрирует базовую структуру интеграционного теста для компонента `AddTask`. Он включает настройку окружения, использование моков API через MSW, проверку корректного поведения при вводе валидных и неверных данных, а также ожидание завершения асинхронных операций.
