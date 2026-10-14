import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import NotFound from './NotFound';

describe('NotFound component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<NotFound />);

      expect(screen.getByText(/Page /i)).toBeInTheDocument();
      expect(screen.getByText(/was not found./i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent(/Go back to tasks/i);
    });

    it('should render custom message prop', () => {
      const customMessage = 'Custom error message';
      render(<NotFound message={customMessage} />);

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('should truncate long pathnames', () => {
      const longPathname = '/very-long-path/to/a/page/that/is/well/beyond/32/characters';
      render(<NotFound message={<div>{longPathname}</div>} />);

      expect(
        screen.getByRole('heading').textContent
      ).toMatchInlineSnapshot(`"404"`);
      expect(screen.getByText(longPathname.substring(0, 29) + "...")).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should navigate to "/" when clicking the button', async () => {
      render(<NotFound />);

      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(window.location.pathname).toEqual('/'));
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: Component.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Component
// ============================================
import renderer from 'react-test-renderer';
import NotFound from './NotFound';

describe('NotFound Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<NotFound />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Custom Message', () => {
    test('should match snapshot with custom message prop', () => {
      const tree = renderer.create(
        <NotFound message={<span>Custom error message</span>} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Long Path Name', () => {
    test('should match snapshot with long path name', () => {
      const tree = renderer.create(
        <NotFound message={"Page /very/long/path/to/page/was/not/found"} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: Component.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Component
// ============================================
Ниже приведён пример кода интеграционного теста компонента `NotFound` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotFound } from './NotFound'; // импортируйте компонент здесь

// Моки серверного запроса
const server = setupServer(
  rest.get('/non-existing-path', (req, res, ctx) =>
    res(ctx.status(404), ctx.json({
      error: 'Page not found'
    }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('NotFound component integration tests', () => {
  it('renders the correct content when page is not found', async () => {
    render(<NotFound message="Page not found" />);

    await waitFor(() => expect(screen.queryByText(/page not found/i)).toBeInTheDocument());

    expect(screen.getByText("404")).toBeInTheDocument(); // проверка заголовка ошибки
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Task Icon'); // проверка иконки задачи
    expect(screen.getByText(/page not found/i)).toBeInTheDocument(); // проверка сообщения об ошибке
    expect(screen.getByText(/go back to tasks/i)).toBeInTheDocument(); // проверка кнопки возврата

    // проверка клика на кнопку возврата
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(window.location.href).toEqual('/')); // ожидание перехода на главную страницу
  });
});
### Объяснение шагов:

1. **Настройка MSW**: Используется библиотека MSW для создания сервера-мокера, который возвращает ошибку 404 при запросе к несуществующему пути `/non-existing-path`.
   
2. **Тестирование отображения контента**: В тестовом методе проверяется корректное отображение всех элементов страницы (`404`, иконка задачи, сообщение об ошибке и кнопка возврата).

3. **Проверка поведения кнопки**: После нажатия на кнопку возврата ожидается переход на домашнюю страницу через проверку изменения URL в браузере.

Этот подход позволяет проверить полный жизненный цикл компонента от получения данных до их отображения и реакции на действия пользователя.
