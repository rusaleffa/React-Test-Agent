/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для Accordion
 * 
 * @file Accordion.integration.test.tsx
 * @description Тестирование Accordion 
 * @generated 2026-09-07T22:12:34.508Z
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

Ниже представлен пример кода интеграционного теста компонента `Accordion` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // Предположим, что используется Redux
import configureStore from 'src/store/configureStore'; // Импортируйте конфигурацию вашего хранилища
import { Accordion } from './Accordion'; // импортируйте компонент Accordion

// Создайте сервер MSW для мокирования сетевого вызова
const server = setupServer(
  rest.get('/api/data', (req, res, ctx) =>
    res(ctx.json({
      data: [
        { name: 'role1', info: 'info1' },
        { name: 'role2', info: 'info2' },
        { name: 'role3', info: 'info3' },
      ],
    }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создайте хранилище Redux
const store = configureStore();

describe('Accordion Integration', () => {
  it('should fetch and display data', async () => {
    render(
      <Provider store={store}>
        <Accordion
          title="Test Title"
          disabled={false}
          data={[]} // данные будут загружены из API
          checkedList=[]
        />
      </Provider>
    );

    // Ожидание завершения сетевого запроса
    await waitFor(() => expect(screen.queryByText(/info1/i)).not.toBeNull());
    await waitFor(() => expect(screen.queryByText(/info2/i)).not.toBeNull());
    await waitFor(() => expect(screen.queryByText(/info3/i)).not.toBeNull());

    // Проверка заголовков чекбоксов
    expect(screen.getByText('info1')).toHaveAttribute('aria-label', 'role1');
    expect(screen.getByText('info2')).toHaveAttribute('aria-label', 'role2');
    expect(screen.getByText('info3')).toHaveAttribute('aria-label', 'role3');

    // Проверка состояния чекбоксов
    expect(screen.getByRole('checkbox').checked).toEqual(false); // По умолчанию чекбокс не отмечен

    // Проверка заголовка аккордиона
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    // Проверка иконки расширения
    expect(screen.getByTitle('Expand more')).toBeInTheDocument();

    // Проверка состояния инпута при клике на чекбокс
    userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox').checked).toEqual(true);
  });
});
Этот пример демонстрирует базовый подход к интеграционным тестам компонента `Accordion`. В реальных сценариях вам может понадобиться расширить тесты дополнительными проверками состояний загрузки (`loading`), ошибок (`error`) или других событий, связанных с компонентом.