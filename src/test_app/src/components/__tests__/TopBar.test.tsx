import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TopBar from '../TopBar';

describe('TopBar', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TopBar title="Default Title" />);
      expect(screen.getByRole('button')).toHaveTextContent('arrow_back_ios_new');
      expect(screen.getByText(/default title/i)).toBeInTheDocument();
    });

    it('should render with custom title prop', () => {
      render(<TopBar title="Custom Title" />);
      expect(screen.getByText(/custom title/i)).toBeInTheDocument();
    });

    it('should handle click event', () => {
      render(<TopBar title="Test Title" />);
      userEvent.click(screen.getByRole('button'));
      expect(userEvent.getURL()).toEqual('/');
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: TopBar.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TopBar
// ============================================
import renderer from 'react-test-renderer';
import { TopBar } from './TopBar'; // импортируйте корректный путь к вашему компоненту

describe('TopBar Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<TopBar />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Title Prop', () => {
    test('should match snapshot with title prop', () => {
      const tree = renderer.create(<TopBar title="Test Title" />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Different Theme', () => {
    test('should match snapshot with different theme', () => {
      const tree = renderer.create(
        <TopBar title="Test Title">
          <TopBar />
        </TopBar>
      ).toJSON(); // имитируем использование компонента в другом контексте с другим стилем
      expect(tree).toMatchSnapshot();
    });
  });

  // Добавьте дополнительные сценарии и комбинации пропсов здесь...
});

// ============================================
// INTEGRATION TESTS
// Файл: TopBar.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TopBar
// ============================================
Ниже приведён пример кода интеграционного теста компонента `TopBar` с использованием библиотеки MSW для мокирования запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopBar } from './TopBar'; // импортируйте компонент здесь
import { BrowserRouter as Router } from 'react-router-dom';

// Моки серверного запроса
const server = setupServer(
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.json({
      status: 'success',
      message: 'Data fetched successfully'
    }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TopBar Integration Tests', () => {
  it('renders correctly with proper title', async () => {
    render(
      <Router>
        <TopBar title="Test Title" />
      </Router>
    );

    expect(screen.getByText(/test title/i)).toBeInTheDocument(); // проверяем отображение заголовка
  });

  it('navigates to previous route when back button is clicked', async () => {
    render(
      <Router>
        <TopBar title="Test Title" />
      </Router>
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    await userEvent.click(backButton); // имитируем клик на кнопку назад

    await waitFor(() => expect(window.location.pathname).toEqual('/')); // ожидаем перехода на корневой маршрут
  });
});
### Объяснение шагов:

1. **Настройка MSW**:  
   Мы используем библиотеку MSW для создания сервера-мокера (`setupServer`) и настройки моков HTTP-запросов. В данном примере мы создали один моковый запрос к `/api/data`.

2. **Тестирование отображения заголовка**:  
   Мы рендерим компонент в контексте роутера и проверяем наличие текста заголовка через метод `getByText`.

3. **Проверка навигации при нажатии кнопки назад**:  
   Мы находим элемент кнопки назад и кликаем на него. После этого проверяем, что текущий URL изменился на корень маршрута (`'/')`, используя `waitFor` для ожидания завершения навигации.

Этот подход позволяет покрыть основные сценарии использования компонента `TopBar`. Вы можете расширить тесты, добавив проверки состояний загрузки, ошибок или других событий, которые могут возникнуть в реальных условиях работы приложения.
