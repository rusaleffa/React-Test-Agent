/**
 * Модульные тесты для изолированной проверки компонента для QRCodeScannerDialog
 * 
 * @file QRCodeScannerDialog.unit.test.tsx
 * @description Тестирование QRCodeScannerDialog 
 * @generated 2026-09-07T22:46:48.667Z
 * @type {unit}
 * @testCount 3
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