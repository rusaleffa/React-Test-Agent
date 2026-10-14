import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AboutTab from '../AboutTab';

describe('AboutTab', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<AboutTab />);

      expect(screen.getByText(/a simple todo app project/i)).toBeInTheDocument();
      expect(screen.getByAltText('Todo App Screenshot')).toBeInTheDocument();
      expect(
        screen.queryByText(/created by maciekt07/i)
      ).not.toBeNull(); // Проверяем наличие ссылки на автора проекта
      expect(
        screen.queryByText(/explore the project on github/i)
      ).not.toBeNull(); // Проверяем ссылку на репозиторий проекта
    });

    it('should show storage usage when available', () => {
      render(<AboutTab storageUsage={1024 * 1024 * 5} />); // симулируем использование хранилища в 5MB

      expect(screen.getByText(/storage usage/i)).toBeInTheDocument();
      expect(screen.getByText(/5.00 mb/i)).toBeInTheDocument();
    });

    it('should not show storage usage if unavailable or zero', () => {
      render(<AboutTab storageUsage={null} />);
      render(<AboutTab storageUsage={0} />);

      expect(screen.queryByText(/storage usage/i)).toBeNull();
    });
  });
});

// Дополнительные тесты можно добавить здесь, если потребуется проверка других аспектов работы компонента

// ============================================
// SNAPSHOT TESTS
// Файл: AboutTab.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для AboutTab
// ============================================
import renderer from 'react-test-renderer';
import AboutTab from './AboutTab';

const createTreeWithProps = (props) =>
  renderer.create(<AboutTab {...props} />).toJSON();

describe('AboutTab Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = createTreeWithProps({});
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Storage Usage', () => {
    test('should match snapshot when storage usage is present', () => {
      const tree = createTreeWithProps({
        storageUsage: 1024 * 1024,
      });
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Without Storage Usage', () => {
    test('should match snapshot when storage usage is not present', () => {
      const tree = createTreeWithProps({
        storageUsage: null,
      });
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error Scenario', () => {
    test('should match snapshot when there is an error', () => {
      const tree = createTreeWithProps({
        storageUsage: undefined,
      });
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: AboutTab.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для AboutTab
// ============================================
Ниже представлен пример кода интеграционного теста для компонента `AboutTab`, который учитывает использование библиотеки MSW для мокирования сетевых запросов и библиотек `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AboutTab from './AboutTab'; // импортируйте компонент здесь

// Моки сетевого запроса к API
const server = setupServer(
  rest.get('/api/storage-estimate', (req, res, ctx) =>
    res(ctx.json({ usage: 1024 * 1024 * 5 })), // имитируем ответ от API
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AboutTab Integration Tests', () => {
  it('should display storage usage correctly when available', async () => {
    render(<AboutTab />);

    // Ждем завершения асинхронной операции
    await waitFor(() => expect(screen.queryByText(/Storage Usage/i)).not.toBeNull());

    // Проверяем отображение информации о хранилище
    expect(screen.getByText(/Storage Usage/i)).toBeInTheDocument();
    expect(screen.getByText(/5.00 MB/i)).toBeInTheDocument(); // ожидаемое значение в мегабайтах
  });

  it('should not show storage usage if unavailable', async () => {
    render(<AboutTab />);

    // Имитация ситуации, когда данные недоступны
    server.use(
      rest.get('/api/storage-estimate', (req, res, ctx) => res(ctx.status(404))),
    );

    // Обновляем страницу после изменения мокированных данных
    render(<AboutTab />);

    // Ожидаем отсутствие элемента с текстом "Storage Usage"
    await waitFor(() => expect(screen.queryByText(/Storage Usage/i)).toBeNull());
  });

  it('should handle errors gracefully', async () => {
    render(<AboutTab />);

    // Имитация сетевой ошибки
    server.use(
      rest.get('/api/storage-estimate', (req, res, ctx) => res(ctx.status(500))),
    );

    // Обновляем страницу после изменения мокированных данных
    render(<AboutTab />);

    // Ожидаем сообщение об ошибке
    await waitFor(() => expect(screen.getByText(/Error fetching storage usage/i)).toBeInTheDocument());
  });
});
Этот набор тестов проверяет следующие аспекты:

- Правильное отображение информации о хранилище при наличии данных.
- Отсутствие отображения информации о хранилище при отсутствии данных.
- Грамотное управление ошибками и их корректное отображение пользователю.

Обратите внимание, что тесты предполагают наличие API `/api/storage-estimate`, который возвращает информацию о хранилище. Если такого API нет или он работает иначе, необходимо соответствующим образом настроить мокирование.
