import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CategoriesContainer from '../CategoriesContainer';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/core';

const mockTheme = createTheme({
  palette: {
    primary: '#ff0000',
    secondary: '#00ff00',
    darkmode: false,
  },
});

describe('CategoriesContainer', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      expect(screen.getByRole('category')).toBeInTheDocument();
    });

    it('should render with dark mode enabled', () => {
      render(
        <ThemeProvider theme={createTheme({ palette: { darkmode: true } })}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      expect(screen.getByRole('category')).toHaveStyle({
        background: '#0000005a',
      });
    });
  });

  describe('Обработка событий', () => {
    it('should handle click event on add category button', async () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      const addCategoryButton = screen.getByRole('button', { name: /add category/i });
      await userEvent.click(addCategoryButton);
      expect(addCategoryButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should update input value when typing in edit name input', async () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      const editNameInput = screen.getByLabelText(/edit name/i);
      await userEvent.type(editNameInput, 'Test Category');
      expect(editNameInput).toHaveValue('Test Category');
    });
  });

  describe('Взаимодействие с дочерними элементами', () => {
    it('should pass correct props to child components', () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      const categoryElement = screen.getByRole('category');
      expect(categoryElement).toHaveStyle({
        background: mockTheme.palette.primary,
        color: mockTheme.palette.secondary,
      });
    });
  });
});

// Примеры моков для дочерних компонентов можно добавить здесь, если они необходимы

// ============================================
// SNAPSHOT TESTS
// Файл: CategoriesContainer.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для CategoriesContainer
// ============================================
import renderer from 'react-test-renderer';
import CategoriesContainer from './CategoriesContainer'; // Импортируйте ваш компонент сюда

// Пример с одним сценарием и несколькими вариантами пропсов
describe('CategoriesContainer Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<CategoriesContainer />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Dark Mode', () => {
    test('should match snapshot in dark mode', () => {
      const tree = renderer.create(
        <CategoriesContainer theme={{ darkmode: true }} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Loading State', () => {
    test('should match snapshot when loading', () => {
      const tree = renderer.create(
        <CategoriesContainer isLoading={true} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Error State', () => {
    test('should match snapshot when error occurs', () => {
      const tree = renderer.create(
        <CategoriesContainer hasError={true} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Data', () => {
    test('should match snapshot with data', () => {
      const tree = renderer.create(
        <CategoriesContainer categories={[{ id: 1, name: 'Test' }]} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Empty Data', () => {
    test('should match snapshot with empty data', () => {
      const tree = renderer.create(
        <CategoriesContainer categories={[]} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // Добавьте больше описаний и тестов в зависимости от ваших требований
});
Этот пример демонстрирует базовую структуру для создания snapshot-тестов вашего компонента `CategoriesContainer`. Вы можете расширить его, добавив дополнительные сценарии и комбинации состояний и пропсов, которые вам необходимы.

// ============================================
// INTEGRATION TESTS
// Файл: CategoriesContainer.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для CategoriesContainer
// ============================================
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
