import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import showToast from '../src/utils/showToast';

describe('showToast', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<showToast message="Test Message" type="success" />);
      expect(screen.getByText(/test message/i)).toBeInTheDocument();
    });

    it('should render with custom type', () => {
      render(<showToast message="Test Warning" type="warning" />);
      expect(screen.queryByText(/warning/i)).not.toBeNull();
    });

    it('should render with custom style', () => {
      render(<showToast message="Test Info" type="info" />);
      expect(screen.queryByText(/info/i)).not.toBeNull();
    });

    it('should render with dismiss button', () => {
      render(<showToast message="Test Dismiss" type="success" dismissButton />);
      const dismissButton = screen.getByText(/dismiss/i);
      fireEvent.click(dismissButton);
      expect(screen.queryByText(/test dismiss/i)).toBeNull();
    });

    it('should render without dismiss button', () => {
      render(<showToast message="Test No Dismiss" type="success" />);
      expect(screen.queryByText(/dismiss/i)).toBeNull();
    });

    it('should render with disableClickDismiss', () => {
      render(<showToast message="Test Click Dismiss" type="success" disableClickDismiss />);
      const toastElement = screen.getByText(/test click dismiss/i);
      fireEvent.click(toastElement);
      expect(screen.queryByText(/test click dismiss/i)).toBeInTheDocument();
    });

    it('should render with preventDuplicate', () => {
      const { rerender } = render(<showToast message="Test Duplicate" type="success" preventDuplicate id="duplicate-id" visibleToasts={[{ id: 'duplicate-id' }]} />);
      rerender(<showToast message="Test Duplicate Again" type="success" preventDuplicate id="duplicate-id" visibleToasts={[{ id: 'duplicate-id' }]} />);
      expect(screen.queryAllByText(/test duplicate again/i).length).toEqual(1);
    });
  });

  describe('Обработка событий', () => {
    it('should call dismiss function on click', () => {
      const mockDismiss = jest.fn();
      render(<showToast message="Test Event" type="success" dismissButton dismissFunction={mockDismiss} />);
      const dismissButton = screen.getByText(/dismiss/i);
      fireEvent.click(dismissButton);
      expect(mockDismiss).toHaveBeenCalledWith('Test Event');
    });
  });

  describe('Вспомогательная функция applyBounce', () => {
    it('should apply bounce effect', () => {
      const element = document.createElement('div');
      element.id = 'test-element';
      document.body.appendChild(element);
      showToast.applyBounce(element);
      expect(element.getAnimations()).toHaveLength(1);
    });
  });
});

// Примечание: поскольку в данном компоненте нет реальных зависимостей или дочерних компонентов, которые необходимо мочить, тесты остаются простыми и изолированными.

// ============================================
// SNAPSHOT TESTS
// Файл: showToast.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для showToast
// ============================================
import renderer from 'react-test-renderer';
import { PriorityHighRounded } from '@mui/icons-material';
import { ToastIconWrapper } from '../styles';
import { ColorPalette } from '../theme/themeConfig';

describe('showToast Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<showToast />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Success Toast', () => {
    test('should match snapshot with success toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Success Message</span>}
          type="success"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error Toast', () => {
    test('should match snapshot with error toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Error Message</span>}
          type="error"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading Toast', () => {
    test('should match snapshot with loading toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Loading...</span>}
          type="loading"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Warning Toast', () => {
    test('should match snapshot with warning toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Warning Message</span>}
          type="warning"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Info Toast', () => {
    test('should match snapshot with info toast', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Info Message</span>}
          type="info"
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Type Warning', () => {
    test('should match snapshot with custom type warning', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Custom Warning Message</span>}
          type="custom"
          style={{
            borderColor: ColorPalette.orange,
          }}
          icon={
            <ToastIconWrapper bgColor={ColorPalette.orange}>
              <PriorityHighRounded />
            </ToastIconWrapper>
          }
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Custom Type Info', () => {
    test('should match snapshot with custom type info', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Custom Info Message</span>}
          type="custom"
          style={{
            borderColor: ColorPalette.blue,
          }}
          icon={
            <ToastIconWrapper bgColor={ColorPalette.blue}>
              <PriorityHighRounded sx={{ transform: 'rotate(180deg)' }} />
            </ToastIconWrapper>
          }
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Disable Click Dismiss', () => {
    test('should match snapshot with disable click dismiss', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Message</span>}
          type="success"
          disableClickDismiss
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Disable Vibrate', () => {
    test('should match snapshot with disable vibrate', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Message</span>}
          type="success"
          disableVibrate
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Dismiss Button', () => {
    test('should match snapshot with dismiss button', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Message</span>}
          type="success"
          dismissButton
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Prevent Duplicate', () => {
    test('should match snapshot with prevent duplicate', () => {
      const tree = renderer.create(
        <showToast
          message={<span>Message</span>}
          type="success"
          preventDuplicate
          id="test-id"
          visibleToasts={[{ id: 'other-id' }]}
        />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

// ============================================
// INTEGRATION TESTS
// Файл: showToast.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для showToast
// ============================================
Ниже представлен пример кода интеграционного теста компонента `showToast`, который соответствует указанным требованиям и структуре:

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux'; // Предположим наличие Redux
import store from './store'; // Импортируйте реальную конфигурацию Redux
import { ToastProvider } from 'react-hot-toast'; // Предположим использование ToastProvider
import { showToast } from '../components/showToast';

const server = setupServer(
  // Моки API здесь
  rest.post('/api/some-endpoint', (req, res, ctx) =>
    res(ctx.json({ someData: 'test' })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('showToast Integration Tests', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <ToastProvider>
          <div>
            <button onClick={() => showToast('Test Message')}>Show Toast</button>
          </div>
        </ToastProvider>
      </Provider>,
    );
  });

  it('should display toast message', async () => {
    await userEvent.click(screen.getByText(/Show Toast/i));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeNull());

    expect(screen.getByRole('alert')).toHaveTextContent('Test Message');
  });

  it('should handle toast with custom type', async () => {
    await userEvent.click(screen.getByText(/Show Toast/i));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeNull());

    expect(screen.getByRole('alert')).toHaveTextContent('Test Message');

    // Проверка кастомного типа сообщения
    expect(screen.getByRole('alert').querySelector('.custom-icon')).toBeTruthy();
  });

  it('should handle toast with dismiss button', async () => {
    await userEvent.click(screen.getByText(/Show Toast/i));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeNull());

    expect(screen.getByRole('alert')).toHaveTextContent('Test Message');

    const dismissButton = screen.getByText('Dismiss');
    await userEvent.click(dismissButton);

    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('should handle toast with duplicate prevention', async () => {
    // Добавьте дополнительные проверки на предотвращение дублирования сообщений
    // Например, проверка через состояние Redux или другие механизмы отслеживания
  });

  it('should handle toast with errors', async () => {
    // Создайте мок с ошибкой и проверьте корректное отображение ошибки в сообщении
  });
});
Этот пример демонстрирует базовую структуру интеграционного тестирования компонента `showToast`. В реальных сценариях вам потребуется настроить моки API, проверить различные сценарии работы с состоянием и событиями, а также протестировать обработку ошибок и асинхронные операции.
