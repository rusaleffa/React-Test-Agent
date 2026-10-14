/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для GreetingHeader
 * 
 * @file GreetingHeader.integration.test.tsx
 * @description Тестирование GreetingHeader 
 * @generated 2026-09-08T13:38:26.298Z
 * @type {integration}
 * @testCount 2
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

Ниже приведён пример кода интеграционного теста компонента `GreetingHeader`, который учитывает использование MSW для мокирования API, а также взаимодействие с Redux или другими провайдерами контекста, если они присутствуют в компоненте.

Допустим, у нас есть простой mock API, возвращающий данные о задачах (`tasks`) и их завершенности (`completedTasks`), которые отображаются в компоненте через пропсы.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // Предположим, что используется Redux
import configureStore from './configureStore'; // Импортируем конфигурированный store
import GreetingHeader from './GreetingHeader';

const tasks = [
  { id: 1, title: 'Task 1' },
  { id: 2, title: 'Task 2' },
];
const completedTasks = 2;

const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.json(tasks));
  }),
  rest.get('/api/completed-tasks', (req, res, ctx) => {
    return res(ctx.json(completedTasks));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GreetingHeader Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = configureStore();
  });

  it('renders correctly with props and state', async () => {
    render(
      <Provider store={store}>
        <GreetingHeader />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByRole('heading')).toBeInTheDocument());

    // Проверка заголовков и текста задачи
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/i)).toBeInTheDocument();

    // Проверяем процент выполнения
    const completionText = screen.getByText(/% Completed:/i);
    expect(completionText).toBeInTheDocument();

    // Проверка кнопки добавления новой задачи
    const addButton = screen.getByRole('button');
    userEvent.click(addButton);

    // Проверка появления всплывающего окна или модального окна при нажатии на кнопку
    // Здесь можно добавить дополнительные проверки поведения кнопки
  });

  it('handles loading and error states', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        throw new Error('API failed');
      })
    );

    render(
      <Provider store={store}>
        <GreetingHeader />
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText(/Error fetching tasks/i)).toBeInTheDocument());
  });
});
### Описание шагов:

1. **Настройка MSW**: Создаём сервер с моками для API запросов к `/api/tasks` и `/api/completed-tasks`.
   
2. **Тестирование отображения данных**: После рендеринга проверяется наличие заголовков задач и текстового контента.

3. **Проверка состояния загрузки и ошибок**: В одном из тестов отключаем успешный ответ от API и проверяем вывод сообщения об ошибке.

4. **Использование Redux**: Компонент обернут в провайдер контекста Redux, чтобы проверить корректность передачи пропсов и состояний между компонентами.

Этот шаблон может быть расширен дополнительными тестами, например, проверкой событий кликов, взаимодействий с анимацией и других аспектов пользовательского интерфейса.