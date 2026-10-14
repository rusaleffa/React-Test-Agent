import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CloseRounded } from '@mui/icons-material';
import CustomDialogTitle from '../CustomDialogTitle';

describe('CustomDialogTitle', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <CustomDialogTitle title="Test Title" />
      );
      expect(screen.getByText(/test title/i)).toBeInTheDocument();
    });

    it('should render with custom subTitle', () => {
      render(
        <CustomDialogTitle title="Test Title" subTitle="Test SubTitle" />
      );
      expect(screen.getByText(/test subtitle/i)).toBeInTheDocument();
    });

    it('should render with icon prop', () => {
      const iconElement = <CloseRounded />;
      render(
        <CustomDialogTitle title="Test Title" icon={iconElement} />
      );
      expect(screen.queryByRole('button')).toBeInTheDocument();
    });

    it('should not render divider if removeDivider is true', () => {
      render(
        <CustomDialogTitle title="Test Title" removeDivider />
      );
      expect(screen.queryByRole('divider')).not.toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
      const mockOnClose = jest.fn();
      render(
        <CustomDialogTitle title="Test Title" onClose={mockOnClose} />
      );
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: CustomDialogTitle.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для CustomDialogTitle
// ============================================
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

// Настройка темы для тестирования
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

describe('CustomDialogTitle Snapshot Tests', () => {
  // Базовый тест с пустыми пропсами и светлой темой
  test('should match snapshot with default props in light theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <CustomDialogTitle />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с подзаголовком и иконкой в светлой теме
  test('should match snapshot with subTitle and icon in light theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <CustomDialogTitle
            title='Test Title'
            subTitle='Test Subtitle'
            icon={<div>Test Icon</div>}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с отключенным делителем в темной теме
  test('should match snapshot without divider in dark theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <CustomDialogTitle
            title='Test Title'
            subTitle='Test Subtitle'
            removeDivider
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с кнопкой закрытия в светлой теме
  test('should match snapshot with close button in light theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <CustomDialogTitle
            title='Test Title'
            onClose={() => {}}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с кнопкой закрытия и делителем в темной теме
  test('should match snapshot with close button and divider in dark theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <CustomDialogTitle
            title='Test Title'
            onClose={() => {}}
            removeDivider={false}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: CustomDialogTitle.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для CustomDialogTitle
// ============================================
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
