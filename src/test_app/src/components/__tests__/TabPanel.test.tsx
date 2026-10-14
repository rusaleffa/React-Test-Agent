import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TabGroupProvider } from '../TabGroupProvider';
import { TabPanel } from '../TabPanel';

describe('TabGroupProvider', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <TabGroupProvider>
          <TabPanel index={0}>Test content</TabPanel>
        </TabGroupProvider>
      );
      expect(screen.queryByText('Test content')).toBeInTheDocument();
    });

    it('should not render child when tab is not active', () => {
      render(
        <TabGroupProvider value={1}>
          <TabPanel index={0}>Test content</TabPanel>
        </TabGroupProvider>
      );
      expect(screen.queryByText('Test content')).not.toBeInTheDocument();
    });

    it('should render child when tab is active', () => {
      render(
        <TabGroupProvider value={0}>
          <TabPanel index={0}>Test content</TabPanel>
        </TabGroupProvider>
      );
      expect(screen.queryByText('Test content')).toBeInTheDocument();
    });

    it('should handle multiple tabs correctly', () => {
      render(
        <TabGroupProvider value={1}>
          <TabPanel index={0}>First tab content</TabPanel>
          <TabPanel index={1}>Second tab content</TabPanel>
        </TabGroupProvider>
      );
      expect(screen.queryByText('First tab content')).not.toBeInTheDocument();
      expect(screen.queryByText('Second tab content')).toBeInTheDocument();

      userEvent.click(screen.getByRole('tab', { name: /second tab/i }));
      expect(screen.queryByText('First tab content')).not.toBeInTheDocument();
      expect(screen.queryByText('Second tab content')).toBeInTheDocument();
    });
  });
});

describe('TabPanel', () => {
  describe('Rendering', () => {
    it('should render without errors', () => {
      render(
        <TabGroupProvider value={0}>
          <TabPanel index={0} />
        </TabGroupProvider>
      );
      expect(() => screen.queryByRole('tabpanel')).not.toThrow();
    });

    it('should hide panel when tab is inactive', () => {
      render(
        <TabGroupProvider value={1}>
          <TabPanel index={0} />
        </TabGroupProvider>
      );
      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    });

    it('should show panel when tab is active', () => {
      render(
        <TabGroupProvider value={0}>
          <TabPanel index={0} />
        </TabGroupProvider>
      );
      expect(screen.queryByRole('tabpanel')).toBeInTheDocument();
    });

    it('should have correct aria attributes', () => {
      render(
        <TabGroupProvider value={0}>
          <TabPanel index={0} />
        </TabGroupProvider>
      );
      const tabPanel = screen.getByRole('tabpanel');
      expect(tabPanel.getAttribute('id')).toMatch(/-tabpanel-\d+/);
      expect(tabPanel.getAttribute('aria-labelledby')).toMatch(/-tab-\d+/);
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: TabGroupProvider.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для TabGroupProvider
// ============================================
import renderer from 'react-test-renderer';
import { TabGroupProvider } from './TabGroupProvider'; // импортируйте корректный путь к вашему компоненту

describe('TabGroupProvider Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<TabGroupProvider />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Name and Value', () => {
    test('should match snapshot with name and value', () => {
      const tree = renderer.create(
        <TabGroupProvider name="testName" value={1}>
          <div />
        </TabGroupProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Children Rendering', () => {
    test('should render children correctly', () => {
      const tree = renderer.create(
        <TabGroupProvider name="testName" value={1}>
          <div data-testid="child">Child Component</div>
        </TabGroupProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match snapshot in error state', () => {
      const tree = renderer.create(
        <TabGroupProvider name="testName" value={null}>
          <div data-testid="error-child">Error Child Component</div>
        </TabGroupProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match snapshot in loading state', () => {
      const tree = renderer.create(
        <TabGroupProvider name="testName" value={undefined}>
          <div data-testid="loading-child">Loading Child Component</div>
        </TabGroupProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Data State', () => {
    test('should match snapshot in data state', () => {
      const tree = renderer.create(
        <TabGroupProvider name="testName" value={2}>
          <div data-testid="data-child">Data Child Component</div>
        </TabGroupProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: TabGroupProvider.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для TabGroupProvider
// ============================================
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabGroupProvider } from './TabGroupProvider'; // импортируйте компонент здесь

// создаем сервер моков
const server = setupServer(
  // добавляем моки для имитации API запросов
  rest.get('/api/tabs', (req, res, ctx) =>
    res(ctx.json([
      { id: 1, title: 'Tab 1' },
      { id: 2, title: 'Tab 2' },
      { id: 3, title: 'Tab 3' },
    ]))
  ),
);

beforeAll(() => server.listen()); // запускаем сервер перед каждым тестом
afterEach(() => server.resetHandlers()); // сбрасываем моки после каждого теста
afterAll(() => server.close()); // закрываем сервер после всех тестов

describe('TabGroupProvider Integration Tests', () => {
  it('should render tabs correctly when fetched successfully', async () => {
    render(
      <TabGroupProvider name="test-group">
        <div>
          <TabPanel index={0}>
            <h1>Content of tab 1</h1>
          </TabPanel>
          <TabPanel index={1}>
            <h1>Content of tab 2</h1>
          </TabPanel>
          <TabPanel index={2}>
            <h1>Content of tab 3</h1>
          </TabPanel>
        </div>
      </TabGroupProvider>,
    );

    await waitFor(() => expect(screen.queryByText(/content of tab 1/i)).toBeInTheDocument());

    // проверяем отображение заголовков табов
    expect(screen.getByText('Content of tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content of tab 2')).not.toBeInTheDocument(); // не должен быть виден
    expect(screen.getByText('Content of tab 3')).not.toBeInTheDocument(); // не должен быть виден

    // переключаемся на второй таб
    userEvent.click(screen.getByRole('tab', { name: /tab 2/i }));

    await waitFor(() => expect(screen.queryByText(/content of tab 2/i)).toBeInTheDocument());

    // проверяем отображение второго таба
    expect(screen.getByText('Content of tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content of tab 1')).not.toBeInTheDocument(); // не должен быть виден
    expect(screen.getByText('Content of tab 3')).not.toBeInTheDocument(); // не должен быть виден

    // переключаемся на третий таб
    userEvent.click(screen.getByRole('tab', { name: /tab 3/i }));

    await waitFor(() => expect(screen.queryByText(/content of tab 3/i)).toBeInTheDocument());

    // проверяем отображение третьего таба
    expect(screen.getByText('Content of tab 3')).toBeInTheDocument();
    expect(screen.getByText('Content of tab 1')).not.toBeInTheDocument(); // не должен быть виден
    expect(screen.getByText('Content of tab 2')).not.toBeInTheDocument(); // не должен быть виден
  });

  it('should handle loading state properly', async () => {
    render(<TabGroupProvider name="test-group"><div><TabPanel index={0} /></div></TabGroupProvider>);

    // ожидаем появления индикатора загрузки
    await waitFor(() => expect(screen.queryByRole('status', { name: /loading/i }).toBeInTheDocument()));

    // имитируем успешный запрос данных
    server.use(
      rest.get('/api/tabs', (req, res, ctx) =>
        res(ctx.delay(100), ctx.json([{ id: 1, title: 'Tab 1' }])),
      ),
    );

    // ждем завершения запроса и проверки контента
    await waitFor(() => expect(screen.queryByText(/tab 1/i).toBeInTheDocument()));
  });

  it('should handle error state properly', async () => {
    render(<TabGroupProvider name="test-group"><div><TabPanel index={0} /></div></TabGroupProvider>);

    // имитируем ошибку при запросе данных
    server.use(rest.get('/api/tabs', (req, res, ctx) => res(ctx.status(500)));

    // ожидаем появления сообщения об ошибке
    await waitFor(() => expect(screen.queryByText(/error occurred/i).toBeInTheDocument()));
  });
});
