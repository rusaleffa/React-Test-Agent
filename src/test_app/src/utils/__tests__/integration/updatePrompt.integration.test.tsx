/**
 * Интеграционные тесты для проверки взаимодействия с зависимостями для updatePrompt
 * 
 * @file updatePrompt.integration.test.tsx
 * @description Тестирование updatePrompt 
 * @generated 2026-09-08T13:40:02.665Z
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

Ниже представлен пример кода интеграционного теста компонента `updatePrompt` с использованием библиотеки MSW для мокирования сетевых запросов и библиотеки `@testing-library/react` для тестирования пользовательского интерфейса.

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpdatePrompt } from './updatePrompt'; // импортируйте компонент здесь

// Моки сетевого запроса
const server = setupServer(
  rest.get('/check-for-update', (req, res, ctx) => {
    return res(ctx.json({
      hasUpdate: true,
      latestVersion: '1.0.1'
    }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('updatePrompt Integration', () => {
  it('should show notification with reload button', async () => {
    render(<UpdatePrompt />); // рендеринг компонента

    await waitFor(() => expect(screen.queryByText(/A new version of the app is available./)).toBeInTheDocument()); // ожидание появления сообщения

    const reloadButton = screen.getByRole('button', { name: /Reload/i }); // поиск кнопки "Reload"
    userEvent.click(reloadButton); // имитация клика на кнопку

    await waitFor(() => expect(screen.queryByText(/A new version of the app is available./)).not.toBeInTheDocument()); // ожидание исчезновения сообщения после нажатия на кнопку
  });

  it('should dismiss notification without reloading', async () => {
    render(<UpdatePrompt />);

    await waitFor(() => expect(screen.queryByText(/A new version of the app is available./)).toBeInTheDocument());

    const dismissButton = screen.getByRole('button', { name: /Dismiss/i }); // поиск кнопки "Dismiss"
    userEvent.click(dismissButton); // имитация клика на кнопку

    await waitFor(() => expect(screen.queryByText(/A new version of the app is available./)).not.toBeInTheDocument()); // ожидание исчезновения сообщения после нажатия на кнопку
  });
});
Этот пример демонстрирует два сценария интеграции:

1. **Показ уведомления с кнопкой перезагрузки** — проверяется появление сообщения о наличии новой версии приложения и наличие кнопки «Перезагрузить».
   
2. **Отмена уведомления без перезагрузки** — проверяется возможность закрытия уведомления без перезагрузки приложения.

Обратите внимание, что в данном примере предполагается использование компонента `UpdatePrompt`, который должен быть импортирован корректно из соответствующего файла проекта. Также необходимо убедиться, что сервер настроен правильно и соответствует требованиям вашего приложения.