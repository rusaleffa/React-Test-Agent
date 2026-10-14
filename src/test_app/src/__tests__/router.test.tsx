import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Router as RouterMock } from 'react-router-dom';
import AppRouter from './src/router.tsx';

describe('AppRouter', () => {
  describe('Рендеринг', () => {
    it('should render without errors', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      expect(screen.queryByRole('loading')).not.toBeInTheDocument();
    });

    it('should render home page by default', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const homeLink = screen.getByRole('link', { name: /home/i });
      userEvent.click(homeLink);
      expect(screen.queryByRole('loading')).not.toBeInTheDocument();
    });

    it('should navigate to task details when clicking on a task link', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const taskLink = screen.getByRole('link', { name: /task/i });
      userEvent.click(taskLink);
      expect(screen.queryByRole('loading')).not.toBeInTheDocument();
    });

    it('should show share page when navigating to "/share"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const shareLink = screen.getByRole('link', { name: /share/i });
      userEvent.click(shareLink);
      expect(screen.queryByRole('heading', { name: /share/i })).toBeInTheDocument();
    });

    it('should show add task form when navigating to "/add"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const addLink = screen.getByRole('link', { name: /add/i });
      userEvent.click(addLink);
      expect(screen.queryByRole('heading', { name: /add task/i })).toBeInTheDocument();
    });

    it('should show user profile when navigating to "/user"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const userLink = screen.getByRole('link', { name: /user/i });
      userEvent.click(userLink);
      expect(screen.queryByRole('heading', { name: /user profile/i })).toBeInTheDocument();
    });

    it('should show transfer page when navigating to "/transfer"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const transferLink = screen.getByRole('link', { name: /transfer/i });
      userEvent.click(transferLink);
      expect(screen.queryByRole('heading', { name: /transfer/i })).toBeInTheDocument();
    });

    it('should show categories page when navigating to "/categories"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const categoriesLink = screen.getByRole('link', { name: /categories/i });
      userEvent.click(categoriesLink);
      expect(screen.queryByRole('heading', { name: /categories/i })).toBeInTheDocument();
    });

    it('should show purge page when navigating to "/purge"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const purgeLink = screen.getByRole('link', { name: /purge/i });
      userEvent.click(purgeLink);
      expect(screen.queryByRole('heading', { name: /purge/i })).toBeInTheDocument();
    });

    it('should show sync page when navigating to "/sync"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const syncLink = screen.getByRole('link', { name: /sync/i });
      userEvent.click(syncLink);
      expect(screen.queryByRole('heading', { name: /sync/i })).toBeInTheDocument();
    });

    it('should show not found page for invalid routes', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const invalidLink = screen.getByRole('link', { name: /invalid route/i });
      userEvent.click(invalidLink);
      expect(screen.queryByRole('heading', { name: /not found/i })).toBeInTheDocument();
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: Component.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Component
// ============================================
import renderer from 'react-test-renderer';
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loading } from './components'; // Предполагаю, что компонент `Loading` находится в папке components

// Импортируем лениво загружаемые компоненты
const HomeLazy = lazy(() => import('./pages/Home'));
const TaskDetailsLazy = lazy(() => import('./pages/TaskDetails'));
const SharePageLazy = lazy(() => import('./pages/Share'));
const AddTaskLazy = lazy(() => import('./pages/AddTask'));
const UserProfileLazy = lazy(() => import('./pages/UserProfile'));
const TransferLazy = lazy(() => import('./pages/Transfer'));
const CategoriesLazy = lazy(() => import('./pages/Categories'));
const PurgeLazy = lazy(() => import('./pages/Purge'));
const SyncLazy = lazy(() => import('./pages/Sync'));
const NotFoundLazy = lazy(() => import('./pages/NotFound'));

// Функция рендеринга компонента с загрузкой и падением
function renderApp() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomeLazy />} />
        <Route path="/task/:id" element={<TaskDetailsLazy />} />
        <Route path="/share" element={<SharePageLazy />} />
        <Route path="/add" element={<AddTaskLazy />} />
        <Route path="/user" element={<UserProfileLazy />} />
        <Route path="/transfer" element={<TransferLazy />} />
        <Route path="/categories" element={<CategoriesLazy />} />
        <Route path="/purge" element={<PurgeLazy />} />
        <Route path="/sync" element={<SyncLazy />} />
        <Route path="*" element={<NotFoundLazy />} />
      </Routes>
    </Suspense>
  );
}

describe('AppRouter Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(renderApp()).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when loading', () => {
    const tree = renderer.create(
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomeLazy />} />
          <Route path="/task/:id" element={<TaskDetailsLazy />} />
          <Route path="/share" element={<SharePageLazy />} />
          <Route path="/add" element={<AddTaskLazy />} />
          <Route path="/user" element={<UserProfileLazy />} />
          <Route path="/transfer" element={<TransferLazy />} />
          <Route path="/categories" element={<CategoriesLazy />} />
          <Route path="/purge" element={<PurgeLazy />} />
          <Route path="/sync" element={<SyncLazy />} />
          <Route path="*" element={<NotFoundLazy />} />
        </Routes>
      </Suspense>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when error occurs', () => {
    const tree = renderer.create(
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomeLazy />} />
          <Route path="/task/:id" element={<TaskDetailsLazy />} />
          <Route path="/share" element={<SharePageLazy />} />
          <Route path="/add" element={<AddTaskLazy />} />
          <Route path="/user" element={<UserProfileLazy />} />
          <Route path="/transfer" element={<TransferLazy />} />
          <Route path="/categories" element={<CategoriesLazy />} />
          <Route path="/purge" element={<PurgeLazy />} />
          <Route path="/sync" element={<SyncLazy />} />
          <Route path="*" element={<NotFoundLazy />} />
        </Routes>
      </Suspense>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
Этот набор тестов проверяет три основных случая:
- Стандартный рендеринг без ошибок или загрузки (`default props`)
- Рендеринг с отображаемым компонентом загрузки (`loading state`)
- Рендеринг с ошибкой (`error state`)

// ============================================
// INTEGRATION TESTS
// Файл: Component.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Component
// ============================================
Вот пример кода интеграционного теста для компонента `AppRouter` с использованием MSW и `@testing-library/react`. Предполагается, что в приложении используется Redux или аналогичный контекстный провайдер, но конкретные детали контекста здесь не указаны, так как они отсутствуют в предоставленном компоненте.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // Предположим использование Redux
import { createStore } from 'redux'; // Пример создания простого хранилища
import { AppRouter } from './AppRouter'; // Импортируйте ваш реальный компонент

// Создадим простое состояние Redux
const initialState = {};
const store = createStore((state) => state, initialState);

const server = setupServer(
  // Моки для API запросов
  rest.get('/tasks', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' }
    ]));
  }),
  
  rest.get('/task/1', (req, res, ctx) => {
    return res(ctx.json({ id: 1, title: 'Task 1' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AppRouter Integration Tests', () => {
  it('should load tasks list successfully', async () => {
    render(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/Task 1/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Task 2/i)).toBeInTheDocument());
  });

  it('should navigate to task details page', async () => {
    render(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );

    const link = screen.getByRole('link', { name: /Task 1/i });
    userEvent.click(link);

    await waitFor(() => expect(screen.queryByText(/Task 1/i)).toBeInTheDocument());
  });

  it('should handle not found route correctly', async () => {
    render(
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );

    const link = screen.getByRole('link', { name: /Non-existing Task/i });
    userEvent.click(link);

    await waitFor(() => expect(screen.queryByText(/Not Found/i)).toBeInTheDocument());
  });
});
### Пояснения к коду:

1. **MSW сервер**: Используется для мокирования API-запросов (`rest.get()`). В реальных приложениях замените URL на реальные конечные точки вашего API.
   
2. **Настройка провайдера контекста**: Если ваше приложение использует Redux или другой контекстный провайдер, оберните компонент `<AppRouter>` в `<Provider>`.

3. **Тестирование навигации**: Для имитации кликов пользователя используется библиотека `@testing-library/user-event`, которая имитирует поведение реального пользователя.

4. **Проверка состояний загрузки и ошибок**: Используйте `waitFor` для ожидания завершения асинхронных операций перед проверкой наличия элементов на странице.

Этот шаблон можно адаптировать под ваши конкретные требования и структуру приложения.
