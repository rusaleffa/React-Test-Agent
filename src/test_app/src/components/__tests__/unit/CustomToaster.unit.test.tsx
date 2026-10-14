/**
 * Модульные тесты для изолированной проверки компонента для CustomToaster
 * 
 * @file CustomToaster.unit.test.tsx
 * @description Тестирование CustomToaster 
 * @generated 2026-09-08T13:19:19.699Z
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
import CustomToaster from '../CustomToaster';
import { ThemeProvider } from '@emotion/react';
import { UserContext } from '../contexts/UserContext';
import { createUserContext } from '../__mocks__/UserContext.mock';

describe('CustomToaster', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = createUserContext();
  });

  describe('Рендеринг', () => {
    it('should render without crashing', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      );
      expect(screen.queryByTestId('toast')).not.toBeNull();
    });

    it('should render with custom styles based on dark mode', () => {
      const theme = {
        darkmode: true,
        primary: '#ff0000',
        secondary: '#ffffff'
      };
      render(
        <UserContext.Provider value={{ settings: { reduceMotion: false }, user }}>
          <ThemeProvider theme={theme}>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      );
      const toasterElement = screen.getByRole('alert');
      expect(toasterElement).toHaveStyle({
        background: '#141431e0',
        color: '#ffffff'
      });
    });

    it('should render with reduced motion styles when reduceMotion is true', () => {
      const theme = {
        darkmode: false,
        primary: '#ff0000',
        secondary: '#ffffff'
      };
      render(
        <UserContext.Provider value={{ settings: { reduceMotion: true }, user }}>
          <ThemeProvider theme={theme}>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      );
      const toasterElement = screen.getByRole('alert');
      expect(toasterElement).toHaveStyle({
        animation: 'none'
      });
    });
  });

  describe('Interaction', () => {
    it('should handle click event', () => {
      render(
        <UserContext.Provider value={mockUser}>
          <ThemeProvider>
            <CustomToaster />
          </ThemeProvider>
        </UserContext.Provider>
      );
      userEvent.click(screen.getByRole('alert'));
      expect(screen.getByRole('alert')).toHaveAttribute('aria-activedescendant');
    });
  });
});