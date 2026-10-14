/**
 * Модульные тесты для изолированной проверки компонента для GlobalStyles
 * 
 * @file GlobalStyles.unit.test.tsx
 * @description Тестирование GlobalStyles 
 * @generated 2026-09-08T13:38:04.483Z
 * @type {unit}
 * @testCount 2
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
import GlobalStyles from './GlobalStyles';  

describe('GlobalStyles', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<GlobalStyles />);
      
      expect(screen.queryAllByRole('global')).toHaveLength(1); // Проверяем наличие глобального элемента
    });
    
    it('should apply custom styles based on theme and settings', () => {
      const mockUser = {
        settings: {
          reduceMotion: 'system'
        }
      };
      const mockTheme = {
        primary: '#ff0000',
        secondary: '#00ff00',
        darkmode: true
      };

      render(
        <UserContext.Provider value={{ user: mockUser }}>
          <GlobalStyles />
        </UserContext.Provider>
      );

      expect(screen.queryAllByRole('global')).toHaveLength(1);

      // Проверим стили на основе темы и настроек пользователя
      expect(document.body.style.colorScheme).toBe(mockTheme.darkmode ? 'dark' : 'light');
      expect(document.body.style.background).toBe(mockTheme.secondary);
      expect(document.body.style.fontFamily).toBe('Poppins, sans-serif');
    });
  });
});