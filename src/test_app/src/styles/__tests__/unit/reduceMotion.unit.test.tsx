/**
 * Модульные тесты для изолированной проверки компонента для reduceMotion
 * 
 * @file reduceMotion.unit.test.tsx
 * @description Тестирование reduceMotion 
 * @generated 2026-09-08T13:38:55.890Z
 * @type {unit}
 * @testCount 4
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
import reduceMotion from '../reduceMotion';

describe('reduceMotion', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<reduceMotion />);
      expect(screen.queryByRole('presentation')).toBeInTheDocument();
    });

    it('should not render when reduceMotion is off', () => {
      const mockTheme = { reduceMotion: 'off' };
      render(<reduceMotion theme={mockTheme} />);
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });

    it('should apply disableStyles when reduceMotion is on', () => {
      const mockTheme = { reduceMotion: 'on' };
      render(<reduceMotion theme={mockTheme} />);
      expect(screen.queryByRole('presentation')).toHaveStyle(
        'animation: none !important; transition: none !important;',
      );
    });

    it('should use media query for prefers-reduced-motion: reduce', () => {
      const mockTheme = { reduceMotion: 'auto' };
      render(<reduceMotion theme={mockTheme} />);
      expect(screen.queryByRole('presentation')).toHaveStyle(
        '@media (prefers-reduced-motion: reduce) {',
      );
    });
  });
});