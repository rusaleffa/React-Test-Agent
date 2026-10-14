/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для Component
 * 
 * @file Component.integration.test.tsx
 * @description Тестирование Component 
 * @generated 2026-09-08T13:32:47.860Z
 * @type {integration}
 * @testCount 1
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