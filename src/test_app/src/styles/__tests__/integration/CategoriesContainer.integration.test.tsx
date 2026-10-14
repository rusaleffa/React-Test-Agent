/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для CategoriesContainer
 * 
 * @file CategoriesContainer.integration.test.tsx
 * @description Тестирование CategoriesContainer 
 * @generated 2026-09-08T13:37:22.501Z
 * @type {integration}
 * @testCount 5
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

Ниже приведён пример кода интеграционного теста для компонента `CategoriesContainer`. Предполагается использование библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoriesContainer } from './CategoriesContainer'; // импортируйте компонент здесь

// Моки серверных запросов
const server = setupServer(
  rest.get('/categories', (req, res, ctx) =>
    res(ctx.json([
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ]))
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CategoriesContainer Integration Tests', () => {
  it('should load categories and display them correctly', async () => {
    render(<CategoriesContainer />);

    await waitFor(() => expect(screen.queryByText(/Category 1/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Category 2/i)).toBeInTheDocument());

    // Проверка отображения категорий в DOM
    expect(screen.queryByText(/Category 1/i)).not.toBeNull();
    expect(screen.queryByText(/Category 2/i)).not.toBeNull();
  });

  it('should handle category creation', async () => {
    render(<CategoriesContainer />);

    // Имитация ввода имени категории
    userEvent.type(screen.getByRole('textbox'), 'New Category');
    userEvent.click(screen.getByRole('button', { name: /add category/i }));

    // Ожидание появления новой категории
    await waitFor(() => expect(screen.queryByText(/New Category/i)).toBeInTheDocument());
  });

  it('should handle editing a category', async () => {
    render(<CategoriesContainer />);

    // Имитация клика на кнопку редактирования первой категории
    userEvent.click(screen.getByRole('button', { name: /edit/i }, { index: 0 }));

    // Имитация изменения названия категории
    userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Updated Name');
    userEvent.click(screen.getByRole('button', { name: /save/i }));

    // Ожидание обновления категории
    await waitFor(() => expect(screen.queryByText(/Updated Name/i)).toBeInTheDocument());
  });

  it('should handle deleting a category', async () => {
    render(<CategoriesContainer />);

    // Имитация клика на кнопку удаления второй категории
    userEvent.click(screen.getByRole('button', { name: /delete/i }, { index: 1 }));

    // Ожидание исчезновения удалённой категории
    await waitFor(() => expect(screen.queryByText(/Category 2/i)).not.toBeInTheDocument());
  });

  it('should handle errors during category creation', async () => {
    server.use(
      rest.post('/categories', (req, res, ctx) => res(ctx.status(400), ctx.json({ error: 'Invalid input' })))
    );

    render(<CategoriesContainer />);

    // Имитация ввода некорректного имени категории
    userEvent.type(screen.getByRole('textbox'), ' ');
    userEvent.click(screen.getByRole('button', { name: /add category/i }));

    // Ожидание сообщения об ошибке
    await waitFor(() => expect(screen.queryByText(/Invalid input/i)).toBeInTheDocument());
  });
});
Этот набор тестов проверяет следующие аспекты:

- Загрузку данных из API и их корректное отображение.
- Создание новых категорий.
- Редактирование существующих категорий.
- Удаление категорий.
- Обработку ошибок при создании категорий.

Обратите внимание, что данный пример предполагает наличие соответствующих элементов интерфейса (`Button`, `TextField`) и их доступность через методы `getByRole()`.

Также учтите, что вам может понадобиться настроить дополнительные моки или проверки в зависимости от специфики вашего приложения и его структуры.