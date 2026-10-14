/**
 * Модульные тесты для изолированной проверки компонента для Sync
 * 
 * @file Sync.unit.test.tsx
 * @description Тестирование Sync 
 * @generated 2026-09-08T13:34:31.486Z
 * @type {unit}
 * @testCount 14
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D @testing-library/user-event

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MockUserContext } from '../../__mocks__/MockContexts';
import Sync from './Sync';

describe('Sync', () => {
  let mockUseContext;
  let mockUseResponsiveDisplay;
  let mockUseOnlineStatus;
  let mockUsePeerSync;

  beforeEach(() => {
    mockUseContext = jest.fn().mockReturnValue(MockUserContext);
    mockUseResponsiveDisplay = jest.fn().mockImplementation(() => false);
    mockUseOnlineStatus = jest.fn().mockReturnValue(true);
    mockUsePeerSync = jest.fn().mockReturnValue({
      mode: '',
      setMode: jest.fn(),
      hostPeerId: '',
      syncStatus: {},
      startHost: jest.fn(),
      connectToHost: jest.fn(),
      otherDataSyncOption: 'this_device',
      setOtherDataSyncOption: jest.fn(),
      otherDataSource: null,
      resetAll: jest.fn(),
    });

    jest.mock('@mui/icons-material', () => ({
      AccessTimeRounded: 'AccessTimeRounded',
      DevicesRounded: 'DevicesRounded',
      QrCodeRounded: 'QrCodeRounded',
      QrCodeScannerRounded: 'QrCodeScannerRounded',
      RestartAltRounded: 'RestartAltRounded',
      SyncProblemRounded: 'SyncProblemRounded',
      WifiOffRounded: 'WifiOffRounded',
      WifiTetheringRounded: 'WifiTetheringRounded',
    }));
  });

  describe('Рендеринг', () => {
    it('отображает заголовок страницы при отсутствии режима', () => {
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      expect(screen.getByText(/Sync Data/i)).toBeInTheDocument();
    });

    it('рендерит кнопку отображения QR-кода в режиме отображения', () => {
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      expect(screen.getByText(/Display QR Code/i)).toBeInTheDocument();
    });

    it('рендерит кнопку сканирования QR-кода в режиме отображения', () => {
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      expect(screen.getByText(/Scan QR Code/i)).toBeInTheDocument();
    });

    it('рендерит QR-код и форму выбора данных в режиме отображения', () => {
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      expect(screen.getByText(/This Device/i)).toBeInTheDocument();
      expect(screen.getByText(/Other Device/i)).toBeInTheDocument();
      expect(screen.getByText(/Don't Sync/i)).toBeInTheDocument();
    });

    it('рендерит индикатор загрузки в режиме ожидания', () => {
      mockUsePeerSync.mockReturnValue({
        mode: '',
        setMode: jest.fn(),
        hostPeerId: '',
        syncStatus: { message: 'Initializing...' },
        startHost: jest.fn(),
        connectToHost: jest.fn(),
        otherDataSyncOption: 'this_device',
        setOtherDataSyncOption: jest.fn(),
        otherDataSource: null,
        resetAll: jest.fn(),
      });
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      expect(screen.getByText(/Initializing.../i)).toBeInTheDocument();
    });

    it('рендерит успешный экран синхронизации после завершения синхронизации', async () => {
      mockUsePeerSync.mockReturnValue({
        mode: 'display',
        setMode: jest.fn(),
        hostPeerId: 'test-id',
        syncStatus: {
          severity: 'success',
          message: 'Sync complete!',
        },
        startHost: jest.fn(),
        connectToHost: jest.fn(),
        otherDataSyncOption: 'this_device',
        setOtherDataSyncOption: jest.fn(),
        otherDataSource: 'this_device',
        resetAll: jest.fn(),
      });
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      await waitFor(() => screen.getByText(/Sync Complete/i));
      expect(screen.getByText(/Sync Complete/i)).toBeInTheDocument();
    });

    it('рендерит ошибку синхронизации при ошибке', async () => {
      mockUsePeerSync.mockReturnValue({
        mode: 'display',
        setMode: jest.fn(),
        hostPeerId: 'test-id',
        syncStatus: {
          severity: 'error',
          message: 'Something went wrong.',
        },
        startHost: jest.fn(),
        connectToHost: jest.fn(),
        otherDataSyncOption: 'this_device',
        setOtherDataSyncOption: jest.fn(),
        otherDataSource: 'this_device',
        resetAll: jest.fn(),
      });
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      await waitFor(() => screen.getByText(/Error/i));
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  describe('Обработка событий', () => {
    it('вызывает функцию отображения QR-кода при нажатии на кнопку отображения', () => {
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      userEvent.click(screen.getByText(/Display QR Code/i));
      expect(mockUsePeerSync.mock.calls[0][1]).toEqual('display');
    });

    it('вызывает функцию сканирования QR-кода при нажатии на кнопку сканирования', () => {
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      userEvent.click(screen.getByText(/Scan QR Code/i));
      expect(mockUsePeerSync.mock.calls[0][1]).toEqual('scan');
    });

    it('вызывает функцию сброса всех настроек при нажатии кнопки сброса', () => {
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      userEvent.click(screen.getByText(/Reset/i));
      expect(mockUsePeerSync.mock.calls[0][1]).toEqual('reset_all');
    });

    it('вызывает функцию подключения к хосту при выборе другого устройства', () => {
      render(
        <MockUserContext.Provider value={MockUserContext}>
          <Sync />
        </MockUserContext.Provider>,
      );
      userEvent.click(screen.getByText(/Other Device/i));
      expect(mockUsePeerSync.mock.calls[0][1]).toEqual('other_device');
    });
  });
});

describe('QRCodeScannerDialog', () => {
  it('открывает диалоговое окно при открытии сканера', () => {
    render(
      <MockUserContext.Provider value={MockUserContext}>
        <Sync />
      </MockUserContext.Provider>,
    );
    userEvent.click(screen.getByText(/Scan QR Code/i));
    expect(screen.queryByRole('dialog')).not.toBeNull();
  });

  it('закрывает диалоговое окно при закрытии сканера', () => {
    render(
      <MockUserContext.Provider value={MockUserContext}>
        <Sync />
      </MockUserContext.Provider>,
    );
    userEvent.click(screen.getByText(/Scan QR Code/i));
    userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('сканирует QR-код и передает результат в обработчик', () => {
    render(
      <MockUserContext.Provider value={MockUserContext}>
        <Sync />
      </MockUserContext.Provider>,
    );
    userEvent.click(screen.getByText(/Scan QR Code/i));
    userEvent.type(screen.getByRole('textbox'), 'test-qr-code');
    userEvent.tab();
    userEvent.click(screen.getByRole('button', { name: /scan/i }));
    expect(mockUsePeerSync.mock.calls[0][1]).toEqual('test-qr-code');
  });
});