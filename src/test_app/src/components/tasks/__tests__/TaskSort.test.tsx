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

// ============================================
// SNAPSHOT TESTS
// Файл: TaskSort.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TaskSort
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import TaskSort from './TaskSort';

// Создаем тему с темным и светлым режимом
const lightTheme = createTheme({
  secondary: '#fff',
  primary: '#0077ff'
});
const darkTheme = createTheme({
  secondary: '#000',
  primary: '#0077ff'
});

describe('TaskSort Snapshot Tests', () => {
  // Тестируем базовый случай без пропсов
  test('should match snapshot without props', () => {
    const tree = renderer.create(
      <ThemeProvider theme={lightTheme}>
        <TaskSort />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай со значением sortOption
  test('should match snapshot with sortOption prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={lightTheme}>
        <TaskSort sortOption="dateCreated" />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай в режиме moveMode
  test('should match snapshot in moveMode', () => {
    const tree = renderer.create(
      <ThemeProvider theme={lightTheme}>
        <TaskSort moveMode={true} />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай в темном режиме
  test('should match snapshot in dark mode', () => {
    const tree = renderer.create(
      <ThemeProvider theme={darkTheme}>
        <TaskSort />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай в темном режиме и со значением sortOption
  test('should match snapshot in dark mode with sortOption', () => {
    const tree = renderer.create(
      <ThemeProvider theme={darkTheme}>
        <TaskSort sortOption="dateCreated" />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай в темном режиме и в режиме moveMode
  test('should match snapshot in dark mode and moveMode', () => {
    const tree = renderer.create(
      <ThemeProvider theme={darkTheme}>
        <TaskSort moveMode={true} />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: TaskSort.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TaskSort
// ============================================
Ниже представлен пример кода интеграционного теста для компонента `TaskSort`. В данном примере используется библиотека MSW для мокирования сетевых запросов и библиотеки `@testing-library/react`, а также `userEvent` для симуляции пользовательского ввода.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskSort from './TaskSort'; // импортируйте компонент здесь

// Моки серверных запросов
const server = setupServer(
  // Мокируем получение данных из API
  rest.get('/tasks', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, title: 'Task A', dueDate: new Date().toISOString() },
      { id: 2, title: 'Task B', dueDate: new Date().toISOString() },
      { id: 3, title: 'Task C', dueDate: new Date().toISOString() },
    ]));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TaskSort Integration Tests', () => {
  it('should display the correct options when sorting tasks', async () => {
    render(<TaskSort />); // рендерим компонент

    // Симулируем клик на кнопку сортировки
    await userEvent.click(screen.getByRole('button'));

    // Ожидаем открытия меню сортировки
    await waitFor(() => expect(screen.queryByRole('menuitem')).not.toBeNull());

    // Проверяем наличие всех опций сортировки в меню
    for (const option of ['Date Created', 'Due Date', 'Alphabetical']) {
      expect(screen.getByText(option)).toBeInTheDocument();
    }

    // Проверка текущего выбранного значения
    expect(screen.getByText(/Current Sorting:/i).parentElement.textContent).toMatch(/Alphabetical/i);

    // Симулируем выбор опции "Due Date"
    await userEvent.click(screen.getByText('Due Date'));

    // Проверяем новое выбранное значение после клика
    expect(screen.getByText(/Current Sorting:/i).parentElement.textContent).toMatch(/Due Date/i);
  });

  it('should show loading state while fetching data', async () => {
    // Отключаем успешный ответ от сервера
    server.use(rest.get('/tasks', (req, res, ctx) => res(ctx.delay(1000)));

    render(<TaskSort />);

    // Ожидание появления индикатора загрузки
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Loading...'));

    // Проверка наличия элементов интерфейса при загрузке
    expect(screen.getByRole('button')).toBeVisible();
    expect(screen.getByText(/Current Sorting:/i)).toBeVisible();

    // Ожидание завершения загрузки
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  it('should handle errors during fetching data', async () => {
    // Устанавливаем ошибку при запросе к API
    server.use(rest.get('/tasks', (req, res, ctx) => res(ctx.status(500), ctx.json({ error: 'Internal Server Error' })));

    render(<TaskSort />);

    // Ожидание появления сообщения об ошибке
    await waitFor(() => expect(screen.getByText('Error: Internal Server Error')).toBeInTheDocument());
  });
});
Этот набор тестов проверяет следующие аспекты:

- Правильное отображение опций сортировки.
- Загрузочное состояние во время получения данных.
- Обработку ошибок при получении данных.

Обратите внимание, что тесты предполагают использование реальных сетевых запросов через API `/tasks`. Если ваш компонент не использует внешний API или данные загружаются локально, вам потребуется изменить мокирование и логику тестирования соответственно.
