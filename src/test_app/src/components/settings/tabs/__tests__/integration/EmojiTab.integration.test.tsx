/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для EmojiTab
 * 
 * @file EmojiTab.integration.test.tsx
 * @description Тестирование EmojiTab 
 * @generated 2026-09-08T13:22:36.929Z
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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as UserContextProvider } from '../../../contexts/UserContext';
import EmojiTab from './EmojiTab';

// Моки для MSW
const server = setupServer(
  // Мокаем получение данных из API или локального хранилища
  rest.get('/api/emojis', (req, res, ctx) =>
    res(ctx.json({
      emojis: ['😊', '🤖', '👑'],
    })),
  ),
  // Мокаем проверку онлайн статуса
  rest.get('/api/isOnline', (req, res, ctx) =>
    res(ctx.json({ online: true })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('EmojiTab Integration', () => {
  it('should display emoji style options and handle selection', async () => {
    render(
      <UserContextProvider>
        <EmojiTab />
      </UserContextProvider>,
    );

    expect(screen.queryByText(/emoji style/i)).toBeInTheDocument(); // Проверяем заголовок

    // Проверка отображения опций
    const radioButtons = screen.queryAllByRole('radio');
    expect(radioButtons).toHaveLength(5); // У нас 5 опций

    // Проверим выбор опции Apple
    await userEvent.click(radioButtons[0]); // Кликаем на первую опцию
    expect(screen.queryByDisplayValue('Apple')).toBeInTheDocument(); // Проверяем выбранную опцию

    // Проверим обновление пользовательских настроек
    const userContext = window.__TEST_USER_CONTEXT__ || {};
    expect(userContext.user.emojisStyle).toEqual('APPLE'); // Проверяем обновленные настройки
  });

  it('should display warning alert in offline mode', async () => {
    server.use(
      rest.get('/api/isOnline', (req, res, ctx) =>
        res(ctx.json({ online: false })), // Отключаем интернет
      ),
    );

    render(
      <UserContextProvider>
        <EmojiTab />
      </UserContextProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/offline mode/i)).toBeInTheDocument(); // Проверяем текст предупреждения
    });
  });

  it('should clear emoji data successfully', async () => {
    render(
      <UserContextProvider>
        <EmojiTab />
      </UserContextProvider>,
    );

    // Нажимаем кнопку очистки данных
    await userEvent.click(screen.queryByText(/clear emoji data/i));

    // Ожидаем появления сообщения о удалении данных
    await waitFor(() => {
      expect(screen.queryByText(/removed emoji data/i)).toBeInTheDocument();
    });

    // Проверяем, что данные были успешно очищены
    expect(localStorage.getItem('epr_suggested')).toBeNull();
  });
});