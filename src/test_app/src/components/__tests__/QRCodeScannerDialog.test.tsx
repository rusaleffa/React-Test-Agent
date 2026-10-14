import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import QRCodeScannerDialog from '../QRCodeScannerDialog';
import { CustomDialogTitle } from './DialogTitle';  
import { QrCodeScannerRounded } from '@mui/icons-material';

describe('QRCodeScannerDialog', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<QRCodeScannerDialog open={true} onClose={() => {}} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('qr-code-scanner-dialog-title')).toHaveTextContent('QR Code Scanner');
      expect(screen.getByTestId('qr-code-scanner-subtitle')).toHaveTextContent('Scan a QR code to proceed');
      expect(screen.getByRole('img', { name: /qr code scanner/i }));
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should render with custom subTitle prop', () => {
      const customSubTitle = 'Custom Sub Title';
      render(
        <QRCodeScannerDialog open={true} onClose={() => {}} subTitle={customSubTitle} />
      );
      expect(screen.getByTestId('qr-code-scanner-subtitle')).toHaveTextContent(customSubTitle);
    });

    it('should call onClose when close button is clicked', () => {
      const mockOnClose = jest.fn();
      render(<QRCodeScannerDialog open={true} onClose={mockOnClose} />);
      userEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: QRCodeScannerDialog.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для QRCodeScannerDialog
// ============================================
import renderer from 'react-test-renderer';
import { QRCodeScannerDialog } from './QRCodeScannerDialog';

describe('QRCodeScannerDialog Snapshot Tests', () => {
  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(<QRCodeScannerDialog />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('With Subtitle', () => {
    test('should match snapshot with subtitle prop', () => {
      const tree = renderer.create(
        <QRCodeScannerDialog subTitle="Test Subtitle" />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match snapshot in loading state', () => {
      const tree = renderer.create(
        <QRCodeScannerDialog scannerProps={{ isLoading: true }} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match snapshot in error state', () => {
      const tree = renderer.create(
        <QRCodeScannerDialog scannerProps={{ hasError: true }} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Data State', () => {
    test('should match snapshot in data state', () => {
      const tree = renderer.create(
        <QRCodeScannerDialog scannerProps={{ hasData: true }} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  };
});

// ============================================
// INTEGRATION TESTS
// Файл: QRCodeScannerDialog.integration.test.tsx
// Описание: Интеграционные тесты для проверки взаимодействия с зависимостями для QRCodeScannerDialog
// ============================================
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store'; // Предположим, что у вас уже настроен Redux Store
import { restApi } from '../api'; // Предположим, что это ваш API клиент
import { QRCodeScannerDialog } from './QRCodeScannerDialog';

// Моки для API
const server = setupServer(
  // Добавьте здесь ваши моки API, если они необходимы
  rest.get('/some-api-endpoint', (req, res, ctx) =>
    res(ctx.json({ someData: 'mocked' })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Создаем маршрутизатор для тестирования навигации
const router = createBrowserRouter([
  {
    path: '/',
    element: <QRCodeScannerDialog />,
  },
]);

describe('QRCodeScannerDialog Integration', () => {
  it('should render dialog with correct props', async () => {
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <RouterProvider router={router}>
          <QRCodeScannerDialog open onClose={() => {}} subTitle="Test Subtitle" />
        </RouterProvider>
      </Provider>,
    );

    expect(screen.queryByRole('dialog')).toBeInTheDocument(); // Проверяем открытие диалога
    expect(screen.queryByText(/QR Code Scanner/i)).toBeInTheDocument(); // Заголовок диалогового окна
    expect(screen.queryByText(/Test Subtitle/i)).toBeInTheDocument(); // Подзаголовок
    expect(screen.queryByLabelText(/qr-code-scanner/i)).toBeInTheDocument(); // Иконка сканера
  });

  it('should handle errors correctly', async () => {
    server.use(
      rest.post('/scan-qr-code', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: 'Invalid QR code' }));
      }),
    );

    render(
      <Provider store={store}>
        <RouterProvider router={router}>
          <QRCodeScannerDialog open onClose={() => {}} subTitle="Test Subtitle" />
        </RouterProvider>
      </Provider>,
    );

    await userEvent.click(screen.queryByRole('button')); // Имитация нажатия на кнопку сканирования
    await waitFor(() => expect(screen.queryByText(/Error scanning QR code./i)).toBeInTheDocument()); // Ожидание сообщения об ошибке
  });

  it('should close the dialog when clicking on Close button', async () => {
    render(
      <Provider store={store}>
        <RouterProvider router={router}>
          <QRCodeScannerDialog open onClose={() => {}} subTitle="Test Subtitle" />
        </RouterProvider>
      </Provider>,
    );

    await userEvent.click(screen.queryByRole('button', { name: /close/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument()); // Ожидание закрытия диалога
  });

  it('should scan QR code successfully', async () => {
    server.use(
      rest.post('/scan-qr-code', (req, res, ctx) => {
        return res(ctx.json({ scannedData: 'valid-data' }));
      }),
    );

    render(
      <Provider store={store}>
        <RouterProvider router={router}>
          <QRCodeScannerDialog open onClose={() => {}} subTitle="Test Subtitle" />
        </RouterProvider>
      </Provider>,
    );

    await userEvent.click(screen.queryByRole('button')); // Имитация нажатия на кнопку сканирования
    await waitFor(() => expect(screen.queryByText(/valid-data/i)).toBeInTheDocument()); // Ожидание успешного результата сканирования
  });
});
