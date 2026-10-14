import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BottomNav from '../BottomNav';
import { UserContext } from '../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';

const mockUser = {
  user: {
    tasks: [
      { id: 1, done: false },
      { id: 2, done: true },
    ],
    settings: {
      enableGlow: true,
      enableCategories: true,
    },
  },
};

const MockUserProvider = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser }}>
    {children}
  </UserContext.Provider>
);

describe('BottomNav', () => {
  describe('Рендеринг', () => {
    it('should render without errors', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      expect(screen.queryByRole('navigation')).toBeInTheDocument();
    });

    it('should render with different routes', async () => {
      render(
        <MemoryRouter initialEntries={['/categories']} initialIndex={0}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.queryByText(/categories/i)).toBeInTheDocument();
      });
    });

    it('should render add button when no tasks', () => {
      render(
        <MemoryRouter initialEntries={['/add']} initialIndex={0}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      expect(screen.queryByText(/add/i)).toBeInTheDocument();
    });

    it('should not render add button when tasks exist', () => {
      render(
        <MemoryRouter initialEntries={['/task']} initialIndex={0}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      expect(screen.queryByText(/add/i)).not.toBeInTheDocument();
    });
  });

  describe('Обработка кликов', () => {
    it('should navigate to task page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /tasks/i }));
      expect(window.location.href).toEqual('/task');
    });

    it('should navigate to categories page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /categories/i }));
      expect(window.location.href).toEqual('/categories');
    });

    it('should navigate to add page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /add/i }));
      expect(window.location.href).toEqual('/add');
    });

    it('should navigate to transfer page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /transfer/i }));
      expect(window.location.href).toEqual('/transfer');
    });

    it('should navigate to profile page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /profile/i }));
      expect(window.location.href).toEqual('/user');
    });
  });
});

// Дополнительные тесты можно добавить здесь, например, проверку анимации или стилей

// ============================================
// SNAPSHOT TESTS
// Файл: BottomNav.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для BottomNav
// ============================================
import renderer from 'react-test-renderer';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MockUser } from '../__mocks__/MockUser';

// Mocking API calls and routes
const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json(MockUser));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('BottomNav Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: MockUser }}>
        <RouterProvider router={createMemoryRouter([])}>
          <BottomNav />
        </RouterProvider>
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when no tasks are present', () => {
    const mockUserWithoutTasks = {
      ...MockUser,
      tasks: []
    };
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUserWithoutTasks }}>
        <RouterProvider router={createMemoryRouter([])}>
          <BottomNav />
        </RouterProvider>
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when there are tasks but all done', () => {
    const mockUserWithDoneTasks = {
      ...MockUser,
      tasks: [
        { id: 1, name: 'Task 1', done: true },
        { id: 2, name: 'Task 2', done: true }
      ]
    };
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUserWithDoneTasks }}>
        <RouterProvider router={createMemoryRouter([])}>
          <BottomNav />
        </RouterProvider>
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when error occurs', () => {
    const mockErrorUser = {
      ...MockUser,
      error: 'An error occurred'
    };
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockErrorUser }}>
        <RouterProvider router={createMemoryRouter([])}>
          <BottomNav />
        </RouterProvider>
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: BottomNav.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для BottomNav
// ============================================
Вот пример кода интеграционного теста для компонента `BottomNav`, учитывая предоставленные требования и зависимости:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContextProvider } from '../contexts/UserContext'; // Предположим, что это провайдер вашего контекста
import { BottomNav } from './BottomNav'; // Импортируйте компонент для тестирования

// Моки сервер запросов
const server = setupServer(
  // Добавьте здесь моки API, если они необходимы
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('BottomNav Integration Tests', () => {
  beforeEach(() => {
    render(
      <UserContextProvider>
        <Router>
          <BottomNav />
        </Router>
      </UserContextProvider>,
    );
  });

  it('should render correctly with different routes', async () => {
    expect(screen.getByText(/tasks/i)).toBeInTheDocument(); // Проверка наличия текста Tasks
    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /tasks/i }));
    });

    expect(screen.queryByText(/tasks/i)).not.toBeInTheDocument(); // Текущий маршрут не должен содержать текст Tasks после клика
    expect(screen.getByText(/categories/i)).toBeInTheDocument(); // Новый маршрут должен содержать текст Categories
  });

  it('should handle click events', async () => {
    userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(window.location.href).toEqual('/add'); // Проверяем URL после клика на кнопку добавления

    userEvent.click(screen.getByRole('button', { name: /transfer/i }));
    expect(window.location.href).toEqual('/transfer');

    userEvent.click(screen.getByRole('button', { name: /user/i }));
    expect(window.location.href).toEqual('/user');
  });

  it('should display correct badges', async () => {
    // Здесь можно добавить тесты отображения значков с учетом количества задач или категорий
    // Например, проверить наличие определенного количества значков при наличии определенных данных в контексте
  });

  it('should handle disabled buttons', async () => {
    // Тестирование кнопки с атрибутом disabled
    expect(screen.getByRole('button', { name: /transfer/i }).getAttribute('aria-disabled')).toBe('true');
  });
});
Этот пример демонстрирует базовую структуру интеграционного теста для компонента `BottomNav`. В реальных условиях вам потребуется настроить моки API и дополнительные проверки состояний и событий, которые зависят от ваших конкретных требований к приложению.
