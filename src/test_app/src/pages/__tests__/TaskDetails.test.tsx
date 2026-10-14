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

// ============================================
// SNAPSHOT TESTS
// Файл: TaskDetails.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TaskDetails
// ============================================
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import TaskDetails from './TaskDetails';
import { UserContext } from '../contexts/UserContext';
import { createUserContext } from '../__mocks__/UserContext.mock';

// Mock the context provider for testing purposes
const mockUserContext = createUserContext({
  tasks: [
    {
      id: '1',
      name: 'Test Task',
      description: 'This is a test task',
      color: '#ff0000',
      date: '2023-09-15T10:00:00Z',
      lastSave: '2023-09-15T10:00:00Z',
      deadline: '2023-09-20T10:00:00Z',
      done: true,
      pinned: false,
      sharedBy: 'John Doe',
      category: ['Work'],
      emoji: ':smile:'
    },
  ],
  emojisStyle: {},
});

describe('TaskDetails Snapshot Tests', () => {
  it('should match snapshot with valid task data', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={mockUserContext}>
            <TaskDetails />
          </UserContext.Provider>
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when task does not exist', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <UserContext.Provider value={mockUserContext}>
            <TaskDetails />
          </UserContext.Provider>
        </MemoryRouter>,
        // Passing an invalid ID that should trigger the not-found component
        { params: { id: 'invalid-id' } }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: TaskDetails.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TaskDetails
// ============================================
Вот пример кода интеграционного теста для компонента `TaskDetails`:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContextProvider } from '../contexts/UserContext'; // Предположим, что это ваш провайдер контекста
import TaskDetails from './TaskDetails'; // Импортируйте компонент, который хотите протестировать

// Создадим простой mock store
const initialState = {
  user: {
    tasks: [
      {
        id: '1',
        name: 'Test Task',
        description: 'This is a test task',
        color: '#ff0000',
        date: '2023-09-15T10:00:00Z',
        lastSave: '2023-09-15T10:00:00Z',
        deadline: '2023-09-20T10:00:00Z',
        done: false,
        pinned: true,
        sharedBy: 'John Doe',
        category: ['Work'],
        emoji: ':smile:'
      },
    ],
    emojisStyle: {},
  },
};

const store = createStore(() => initialState);

// Моки сервер для имитации API запросов
const server = setupServer(
  rest.get('/tasks/:id', (req, res, ctx) => {
    const id = req.params.id.replace('.', '');
    const task = initialState.user.tasks.find(t => t.id.toString().replace('.', '') === id);
    return res(ctx.json(task));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TaskDetails Integration', () => {
  it('should fetch and display data', async () => {
    render(
      <Provider store={store}>
        <UserContextProvider>
          <TaskDetails match={{ params: { id: '1' } }} />
        </UserContextProvider>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByText(/Task Details/i)).toBeInTheDocument());

    // Проверяем отображение данных
    expect(screen.getByText('Task: Test Task')).toBeInTheDocument();
    expect(screen.getByText(':smile: (':smile:)')).toBeInTheDocument();
    expect(screen.getByText('ID: 1')).toBeInTheDocument();
    expect(screen.getByText('Description: This is a test task')).toBeInTheDocument();
    expect(screen.getByText('Color: #ff0000 (FF0000)')).toBeInTheDocument();
    expect(screen.getByText('Created: September 15, 2023, 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Last edited: September 15, 2023, 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Task deadline: September 20, 2023, 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Done: ❌ false')).toBeInTheDocument();
    expect(screen.getByText('Pinned: ✅ true')).toBeInTheDocument();
    expect(screen.getByText('Shared by: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Categories: Work')).toBeInTheDocument();
  });
});
### Описание шагов:

1. **Настройка MSW сервера**: Мы используем MSW для создания мок-сервера, чтобы имитировать поведение API.
   
2. **Настройка провайдера контекста**: В данном примере предполагается наличие провайдера контекста (`UserContextProvider`), который предоставляет данные о пользователе и его задачах.

3. **Тестирование API вызовов**: Мы проверяем успешный запрос к API и получение задачи из списка задач пользователя.

4. **Проверка состояний загрузки и ошибок**: Поскольку в данном компоненте нет явного использования асинхронности или зависимых эффектов, проверка состояний загрузки не требуется.

5. **Тестирование пользовательского интерфейса**: После того как задача успешно загружена, мы проверяем корректность отображения всех полей на странице.

Этот подход позволяет убедиться, что компонент корректно взаимодействует со своим окружением и правильно отображает данные.
