/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для CustomDialogTitle
 * 
 * @file CustomDialogTitle.integration.test.tsx
 * @description Тестирование CustomDialogTitle 
 * @generated 2026-09-07T22:44:48.145Z
 * @type {integration}
 * @testCount 4
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, msw
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D msw

Ниже приведён пример кода интеграционного теста для компонента `CustomDialogTitle` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store'; // Предположим, что у вас уже настроен Redux Store
import { RouterProvider } from 'react-router';
import { CustomDialogTitle } from './components/CustomDialogTitle'; // Импортируйте компонент здесь

// Моки сервер
const server = setupServer(
  // Если ваш компонент использует внешний API, добавьте сюда моки
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.json({
      title: 'Test Title',
      subTitle: 'Test Subtitle'
    }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CustomDialogTitle Integration Tests', () => {
  it('renders dialog with correct title and sub-title', async () => {
    render(
      <Provider store={store}>
        <RouterProvider router={createMemoryRouter([])}>
          <CustomDialogTitle title="Test Title" subTitle="Test Subtitle" />
        </RouterProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText(/test title/i)).toBeInTheDocument());
    expect(screen.getByText(/test subtitle/i)).toBeInTheDocument();
  });

  it('closes the dialog when close button is clicked', async () => {
    render(
      <Provider store={store}>
        <RouterProvider router={createMemoryRouter([])}>
          <CustomDialogTitle title="Test Title" onClose={() => console.log("closed")} />
        </RouterProvider>
      </Provider>
    );

    const closeButton = screen.getByRole('button');
    userEvent.click(closeButton);

    await waitFor(() => expect(closeButton).not.toBeInTheDocument());
  });

  it('displays custom icon in title container', async () => {
    const testIcon = <div>Test Icon</div>;
    render(
      <Provider store={store}>
        <RouterProvider router={createMemoryRouter([])}>
          <CustomDialogTitle title="Test Title" icon={testIcon} />
        </RouterProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/test icon/i)).toBeInTheDocument());
  });

  it('hides divider if removeDivider prop is true', async () => {
    render(
      <Provider store={store}>
        <RouterProvider router={createMemoryRouter([])}>
          <CustomDialogTitle title="Test Title" removeDivider />
        </RouterProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByRole('separator')).toBeNull());
  });
});
Этот набор тестов проверяет следующие аспекты:

- Правильное отображение заголовка и подзаголовка.
- Закрытие диалогового окна при нажатии кнопки закрытия.
- Отображение кастомного иконки в контейнере заголовка.
- Скрытие разделителя (`Divider`) при использовании пропа `removeDivider`.

Обратите внимание, что тесты предполагают наличие настроенного Redux Store и маршрутизатора `react-router`. В реальных сценариях вам может потребоваться настроить дополнительные моки или проверки на основе вашего конкретного приложения.