import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Loading from '../Loading';

describe('Loading', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<Loading />);
      expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    });

    it('should not show loading initially', async () => {
      render(<Loading />);
      await screen.findByRole('progressbar');
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should show loading after timeout', async () => {
      render(<Loading />);
      await userEvent.wait(150);
      expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: Loading.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для Loading
// ============================================
import renderer from 'react-test-renderer';
import { Loading } from './path/to/component'; // Замените на реальный путь к компоненту

describe('Loading Snapshot Tests', () => {
  describe('Default State', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<Loading />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match snapshot when showLoading is true', () => {
      const tree = renderer.create(<Loading showLoading={true} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    // Добавьте тесты для ошибки, если это применимо
    // Например:
    // test('should match snapshot when error occurs', () => {
    //   const tree = renderer.create(<Loading error={true} />).toJSON();
    //   expect(tree).toMatchSnapshot();
    // });
  });

  describe('Data State', () => {
    // Добавьте тесты для отображения данных, если это применимо
    // Например:
    // test('should match snapshot when data is loaded', () => {
    //   const tree = renderer.create(<Loading data={{}}/>).toJSON();
    //   expect(tree).toMatchSnapshot();
    // });
  });
});
Замените `./path/to/component` на правильный путь до вашего компонента в проекте и добавьте недостающие сценарии тестирования состояний или ошибок, если они предусмотрены вашим компонентом.

// ============================================
// INTEGRATION TESTS
// Файл: Loading.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для Loading
// ============================================
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // Предположим, что используется Redux
import configureStore from './configureStore'; // Импортируйте функцию конфигурации вашего хранилища
import Loading from './Loading'; // импортируйте компонент Loading

// Создайте сервер мокапов
const server = setupServer(
  // Моки для API, если они существуют
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.json({ data: ['item1', 'item2'] }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создайте хранилище Redux
const store = configureStore();

describe('Loading Integration', () => {
  it('should show loading spinner when fetching data', async () => {
    render(
      <Provider store={store}>
        <Loading />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument()); // Ожидание появления прогрессбара
    expect(screen.queryByText(/loading/i)).toBeInTheDocument(); // Проверка наличия текста "Загрузка"
  });

  it('should hide loading spinner and display fetched data', async () => {
    render(
      <Provider store={store}>
        <Loading />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());

    // Имитация завершения запроса данных
    server.use(
      rest.get('/api/data', (req, res, ctx) =>
        res(ctx.delay(100), ctx.json({ data: ['item1', 'item2'] }))
      )
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(screen.queryByText(/item1/i)).toBeInTheDocument();
    expect(screen.queryByText(/item2/i)).toBeInTheDocument();
  });
});
Этот пример демонстрирует базовую структуру интеграционного теста компонента `Loading`. Он включает в себя настройку моков API с помощью MSW, проверку отображения и скрытия спиннера во время выполнения асинхронной операции. Обратите внимание на использование `waitFor` для ожидания изменений DOM и проверки состояний.
