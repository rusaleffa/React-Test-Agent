import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GreetingHeader from '../GreetingHeader';

describe('GreetingHeader', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<GreetingHeader />);
      expect(screen.getByRole('heading')).toHaveTextContent('Greeting Header');
    });

    it('should render with custom prop', () => {
      render(<GreetingHeader greeting="Custom Greeting" />);
      expect(screen.getByText(/Custom Greeting/)).toBeInTheDocument();
    });

    it('should handle media queries', () => {
      render(<GreetingHeader />);
      userEvent.resizeWindow(500, 500); // simulate small screen
      expect(screen.getByRole('heading')).toHaveStyle({
        fontSize: '22px',
      });
    });
  });
});

describe('TasksCountContainer', () => {
  it('should render tasks count container', () => {
    render(
      <GreetingHeader>
        <TasksCountContainer />
      </GreetingHeader>
    );
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});

describe('TaskCountTextContainer', () => {
  it('should render task count text container', () => {
    render(
      <GreetingHeader>
        <TaskCountTextContainer />
      </GreetingHeader>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

describe('TaskCountHeader', () => {
  it('should render task count header', () => {
    render(
      <GreetingHeader>
        <TaskCountHeader />
      </GreetingHeader>
    );
    expect(screen.getByRole('heading')).toHaveTextContent('');
  });
});

describe('TaskCompletionText', () => {
  it('should render task completion text', () => {
    render(
      <GreetingHeader>
        <TaskCompletionText />
      </GreetingHeader>
    );
    expect(screen.getByText('Task Completion Text')).toBeInTheDocument();
  });
});

describe('ProgressPercentageContainer', () => {
  it('should render progress percentage container', () => {
    render(
      <GreetingHeader>
        <ProgressPercentageContainer />
      </GreetingHeader>
    );
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });
});

describe('AddButton', () => {
  it('should render add button', () => {
    render(
      <GreetingHeader>
        <AddButton />
      </GreetingHeader>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should trigger click event', () => {
    render(
      <GreetingHeader>
        <AddButton />
      </GreetingHeader>
    );
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveFocus();
  });
});

describe('Offline', () => {
  it('should render offline component', () => {
    render(
      <GreetingHeader>
        <Offline />
      </GreetingHeader>
    );
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: GreetingHeader.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для GreetingHeader
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { GreetingHeader } from './GreetingHeader'; // Импортируйте компонент здесь

const lightTheme = createTheme({
  palette: {
    primary: '#ff5a5f',
    secondary: '#00acc1'
  },
  typography: {},
  shape: {}
});

const darkTheme = createTheme({
  palette: {
    primary: '#ff5a5f',
    secondary: '#00acc1'
  },
  typography: {},
  shape: {},
  direction: 'ltr',
  overrides: {}
});

describe('GreetingHeader Snapshot Tests', () => {
  test('should match snapshot in light mode with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <GreetingHeader />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark mode with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <GreetingHeader />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in light mode with tasks count prop', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <GreetingHeader tasksCount={{ count: 10 }} />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark mode with tasks count prop', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <GreetingHeader tasksCount={{ count: 10 }} />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in light mode with task completion percentage', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <GreetingHeader taskCompletionPercentage={75} />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark mode with task completion percentage', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <GreetingHeader taskCompletionPercentage={75} />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in light mode with offline status', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <GreetingHeader offline />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark mode with offline status', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <GreetingHeader offline />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Добавьте дополнительные тесты для других сценариев и состояний компонента
});

// ============================================
// INTEGRATION TESTS
// Файл: GreetingHeader.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для GreetingHeader
// ============================================
Ниже приведён пример кода интеграционного теста компонента `GreetingHeader`, который учитывает использование MSW для мокирования API, а также взаимодействие с Redux или другими провайдерами контекста, если они присутствуют в компоненте.

Допустим, у нас есть простой mock API, возвращающий данные о задачах (`tasks`) и их завершенности (`completedTasks`), которые отображаются в компоненте через пропсы.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // Предположим, что используется Redux
import configureStore from './configureStore'; // Импортируем конфигурированный store
import GreetingHeader from './GreetingHeader';

const tasks = [
  { id: 1, title: 'Task 1' },
  { id: 2, title: 'Task 2' },
];
const completedTasks = 2;

const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.json(tasks));
  }),
  rest.get('/api/completed-tasks', (req, res, ctx) => {
    return res(ctx.json(completedTasks));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GreetingHeader Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = configureStore();
  });

  it('renders correctly with props and state', async () => {
    render(
      <Provider store={store}>
        <GreetingHeader />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByRole('heading')).toBeInTheDocument());

    // Проверка заголовков и текста задачи
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/i)).toBeInTheDocument();

    // Проверяем процент выполнения
    const completionText = screen.getByText(/% Completed:/i);
    expect(completionText).toBeInTheDocument();

    // Проверка кнопки добавления новой задачи
    const addButton = screen.getByRole('button');
    userEvent.click(addButton);

    // Проверка появления всплывающего окна или модального окна при нажатии на кнопку
    // Здесь можно добавить дополнительные проверки поведения кнопки
  });

  it('handles loading and error states', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        throw new Error('API failed');
      })
    );

    render(
      <Provider store={store}>
        <GreetingHeader />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/Error fetching tasks/i)).toBeInTheDocument());
  });
});
### Описание шагов:

1. **Настройка MSW**: Создаём сервер с моками для API запросов к `/api/tasks` и `/api/completed-tasks`.
   
2. **Тестирование отображения данных**: После рендеринга проверяется наличие заголовков задач и текстового контента.

3. **Проверка состояния загрузки и ошибок**: В одном из тестов отключаем успешный ответ от API и проверяем вывод сообщения об ошибке.

4. **Использование Redux**: Компонент обернут в провайдер контекста Redux, чтобы проверить корректность передачи пропсов и состояний между компонентами.

Этот шаблон может быть расширен дополнительными тестами, например, проверкой событий кликов, взаимодействий с анимацией и других аспектов пользовательского интерфейса.
