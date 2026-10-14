/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для RenderTaskDescription
 * 
 * @file RenderTaskDescription.integration.test.tsx
 * @description Тестирование RenderTaskDescription 
 * @generated 2026-09-08T13:24:35.103Z
 * @type {integration}
 * @testCount 3
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

Вот пример кода интеграционного теста для компонента `RenderTaskDescription`:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskContextProvider } from '../../contexts/TaskContext'; // Предположим, что TaskContext существует
import { RenderTaskDescription } from './RenderTaskDescription';

// Моки сервер API
const server = setupServer(
  rest.get('/tasks/:id', (req, res, ctx) => {
    const taskId = req.params.id;
    const mockTask = {
      id: taskId,
      description: `This is a long description that needs truncation or showing more...`,
      color: '#ff0000',
    };
    return res(ctx.json(mockTask));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('RenderTaskDescription Integration Tests', () => {
  it('renders correctly with short description', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id' }} />
      </TaskContextProvider>,
    );

    expect(screen.queryByText(/This is a long description/i)).toBeNull();
  });

  it('truncates long description and shows "show more" button', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id', description: 'long description...' }} />
      </TaskContextProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/long description/i)).not.toBeNull();
      expect(screen.queryByText(/show more/i)).toBeTruthy();
    });
  });

  it('shows full description when clicking "show more"', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id', description: 'long description...' }} />
      </TaskContextProvider>,
    );

    userEvent.click(screen.getByText(/show more/i));

    await waitFor(() => {
      expect(screen.queryByText(/long description/i)).toBeInTheDocument();
      expect(screen.queryByText(/show less/i)).toBeTruthy();
    });
  });

  it('hides "show more" button after expanding', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id', description: 'long description...' }} />
      </TaskContextProvider>,
    );

    userEvent.click(screen.getByText(/show more/i));

    await waitFor(() => {
      expect(screen.queryByText(/show more/i)).toBeNull();
      expect(screen.queryByText(/show less/i)).toBeInTheDocument();
    });
  });

  it('handles empty description', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id', description: '' }} />
      </TaskContextProvider>,
    );

    expect(screen.queryByText(/no description/i)).toBeNull();
  });

  it('handles missing description', async () => {
    render(
      <TaskContextProvider>
        <RenderTaskDescription task={{ id: 'test-id' }} />
      </TaskContextProvider>,
    );

    expect(screen.queryByText(/no description/i)).toBeInTheDocument();
  });
});
Этот набор тестов проверяет следующие сценарии:

- Корректное отображение короткого описания без кнопки «показать больше».
- Отображение укороченного описания и наличие кнопки «показать больше» при длинном описании.
- Переход от краткого к полному описанию после нажатия на кнопку «показать больше».
- Скрытие кнопки «показать больше», когда описание полностью раскрыто.
- Отсутствие текста в случае отсутствия описания.
- Отсутствие текста в случае пустого описания.

Обратите внимание, что тесты предполагают наличие контекста `TaskContext`, который должен быть настроен соответствующим образом перед рендерингом компонента.