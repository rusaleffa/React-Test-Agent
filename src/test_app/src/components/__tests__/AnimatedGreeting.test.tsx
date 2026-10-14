import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AnimatedGreeting from '../AnimatedGreeting';
import { UserContext } from '../contexts/UserContext';
import { getRandomGreeting } from '../utils';

describe('AnimatedGreeting', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      user: {},
      emojisStyle: {}
    };
    jest.spyOn(UserContext, 'useContext').mockImplementation(() => mockUser);
  });

  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<AnimatedGreeting />);
      expect(screen.getByText(getRandomGreeting())).toBeInTheDocument();
    });

    it('should render with custom greeting', () => {
      const customGreeting = 'Hello World!';
      mockUser.user.greeting = customGreeting;
      render(<AnimatedGreeting />);
      expect(screen.getByText(customGreeting)).toBeInTheDocument();
    });

    it('should not render when in print mode', () => {
      window.print = jest.fn();
      render(<AnimatedGreeting />);
      expect(window.print).not.toHaveBeenCalled();
    });
  });

  describe('Обновление состояния', () => {
    it('should update greeting after 6 seconds', async () => {
      const randomGreetingSpy = jest.spyOn(getRandomGreeting, 'getRandomGreeting');
      render(<AnimatedGreeting />);
      await waitFor(() => {
        expect(randomGreetingSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Взаимодействие с дочерними элементами', () => {
    it('should pass correct prop to child components', () => {
      render(<AnimatedGreeting />);
      const childComponent = screen.getAllByRole('img')[0];
      expect(childComponent.props.unified).toBeDefined();
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: AnimatedGreeting.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для AnimatedGreeting
// ============================================
import renderer from 'react-test-renderer';
import { UserContext } from '../contexts/UserContext';  
import { AnimatedGreeting } from './AnimatedGreeting';

// Mock context provider for testing
const mockUserContext = {
  user: {
    emojisStyle: {},
  },
};

describe('AnimatedGreeting Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(
      <UserContext.Provider value={mockUserContext}>
        <AnimatedGreeting />
      </UserContext.Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when greeting is loading', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ ...mockUserContext, user: { ...mockUserContext.user, isLoading: true } }}>
        <AnimatedGreeting />
      </UserContext.Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when greeting has error', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ ...mockUserContext, user: { ...mockUserContext.user, hasError: true } }}>
        <AnimatedGreeting />
      </UserContext.Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when no emojis are available', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          emojisStyle: undefined,
        },
      }}
      >
        <AnimatedGreeting />
      </UserContext.Provider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: AnimatedGreeting.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для AnimatedGreeting
// ============================================
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { UserContext } from '../contexts/UserContext'; // Предположим, что UserContext определен здесь
import { AnimatedGreeting } from './AnimatedGreeting'; // Импортируйте компонент, который хотите протестировать

// Создайте mock store или context provider, если необходимо
const mockUserContext = {
  user: {
    emojisStyle: {},
  },
};

const mockStore = createStore(() => ({}));

const server = setupServer(
  // Моки для API, если они существуют
  rest.get('/api/greetings', (req, res, ctx) =>
    res(ctx.json([{ greeting: 'Hello World' }])),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AnimatedGreeting Integration Tests', () => {
  it('should display random greeting with animated effect', async () => {
    render(
      <Provider store={mockStore}>
        <UserContext.Provider value={mockUserContext}>
          <AnimatedGreeting />
        </UserContext.Provider>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByRole('heading')).toBeInTheDocument());

    // Проверка наличия анимации и отображения текста
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });

  it('should handle loading state correctly', async () => {
    render(
      <Provider store={mockStore}>
        <UserContext.Provider value={mockUserContext}>
          <AnimatedGreeting />
        </UserContext.Provider>
      </Provider>,
    );

    // Ожидаем появления индикатора загрузки
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeInTheDocument());

    // Проверяем, что индикатор исчезает после получения данных
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
  });

  it('should handle error state correctly', async () => {
    server.use(
      rest.get('/api/greetings', (req, res, ctx) => res(ctx.status(500), ctx.json({ message: 'Error fetching greetings' }))),
    );

    render(
      <Provider store={mockStore}>
        <UserContext.Provider value={mockUserContext}>
          <AnimatedGreeting />
        </UserContext.Provider>
      </Provider>,
    );

    // Ожидаем появления сообщения об ошибке
    await waitFor(() => expect(screen.queryByText('Error fetching greetings')).toBeInTheDocument());
  });
});
Этот пример демонстрирует базовую структуру интеграционного теста для компонента `AnimatedGreeting`. В нем используются моки API через MSW, а также проверяются различные сценарии работы компонента — от корректного отображения данных до обработки состояний загрузки и ошибок.
