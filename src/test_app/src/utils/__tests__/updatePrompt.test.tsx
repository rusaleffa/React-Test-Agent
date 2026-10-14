import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import updatePrompt from '../updatePrompt';

describe('updatePrompt', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<updatePrompt />);
      expect(screen.queryByRole('button')).toBeInTheDocument();
    });

    it('should render dismiss button', () => {
      render(<updatePrompt />);
      expect(screen.getByText(/dismiss/i)).toBeInTheDocument();
    });

    it('should render reload button', () => {
      render(<updatePrompt />);
      expect(screen.getByText(/reload/i)).toBeInTheDocument();
    });

    it('should not show prompt without installing worker', () => {
      const mockSW = {
        addEventListener: jest.fn(),
        installing: null,
      };
      render(<updatePrompt r={mockSW} />);
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('should not show prompt if controller is not set', () => {
      const mockSW = {
        addEventListener: jest.fn(),
        installing: {},
      };
      render(<updatePrompt r={mockSW} />);
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    let mockToastDismiss;
    beforeEach(() => {
      mockToastDismiss = jest.fn();
      global.toast = {
        dismiss: mockToastDismiss,
      };
    });

    afterEach(() => {
      delete global.toast;
    });

    it('should dismiss toast on click', async () => {
      render(<updatePrompt />);
      await userEvent.click(screen.getByText(/dismiss/i));
      expect(mockToastDismiss).toHaveBeenCalledTimes(1);
    });

    it('should reload app on click', async () => {
      render(<updatePrompt />);
      await userEvent.click(screen.getByText(/reload/i));
      expect(global.toast.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: updatePrompt.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для updatePrompt
// ============================================
import renderer from 'react-test-renderer';
import { Toast } from 'react-hot-toast';
import { Stack, Typography } from '@mui/material';
import UpdateRounded from '@mui/icons-material/UpdateRounded';
import { updatePrompt } from './updatePrompt'; // Подставьте путь к вашему компоненту

// Имитация объекта Toast из react-hot-toast
const mockToast = {
  dismiss: jest.fn(),
  id: 'test-id',
};

jest.mock('react-hot-toast', () => ({
  toast: (cb) => cb(mockToast),
}));

describe('updatePrompt Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(<updatePrompt />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with dismissed toast', () => {
    const tree = renderer.create(<updatePrompt />).toJSON(); // Повторно рендерим, чтобы получить обновленный UI
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with reload button clicked', () => {
    const tree = renderer.create(
      <updatePrompt />,
    ).toJSON();
    // Имитация клика на кнопку "Reload"
    tree.findWhere(node => node.type === 'Button' && node.props.children.includes('Reload')).props.onClick();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with dismiss button clicked', () => {
    const tree = renderer.create(
      <updatePrompt />,
    ).toJSON();
    // Имитация клика на кнопку "Dismiss"
    tree.findWhere(node => node.type === 'Button' && node.props.children.includes('Dismiss')).props.onClick();
    expect(tree).toMatchSnapshot();
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: updatePrompt.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для updatePrompt
// ============================================
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
