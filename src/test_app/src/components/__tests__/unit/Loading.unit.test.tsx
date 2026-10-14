/**
 * Модульные тесты для изолированной проверки компонента для Loading
 * 
 * @file Loading.unit.test.tsx
 * @description Тестирование Loading 
 * @generated 2026-09-07T22:46:06.991Z
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
import Loading from '../Loading';

describe('Loading', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<Loading />);
      expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    });

    it('should not show loading initially', async () => {
      render(<Loading />);
      await screen.findByRole('progressbar');
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should show loading after timeout', async () => {
      render(<Loading />);
      await userEvent.wait(150);
      expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    });
  });
});