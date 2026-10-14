/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для Categories
 * 
 * @file Categories.integration.test.tsx
 * @description Тестирование Categories 
 * @generated 2026-09-08T13:31:55.028Z
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