/**
 * Модульные тесты для изолированной проверки компонента для StyledTabPanel
 * 
 * @file StyledTabPanel.unit.test.tsx
 * @description Тестирование StyledTabPanel 
 * @generated 2026-09-08T13:21:32.514Z
 * @type {unit}
 * @testCount 5
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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import StyledTabPanel from './StyledTabPanel';

const mockChildComponent = ({ children }) => children;

const theme = createTheme({
  palette: {
    primary: '#ff0000',
  },
  darkmode: false,
});

describe('StyledTabPanel', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <ThemeProvider theme={theme}>
          <StyledTabPanel>
            <mockChildComponent>Test Content</mockChildComponent>
          </StyledTabPanel>
        </ThemeProvider>
      );
      expect(screen.getByText(/test content/i)).toBeInTheDocument();
    });

    it('should apply custom styles based on theme', () => {
      render(
        <ThemeProvider theme={theme}>
          <StyledTabPanel>
            <mockChildComponent>Test Content</mockChildComponent>
          </StyledTabPanel>
        </ThemeProvider>
      );
      expect(screen.getByText(/test content/i)).toHaveStyleRule('background-color', theme.primary + '23');
    });

    it('should handle responsive display correctly', () => {
      render(
        <ThemeProvider theme={theme}>
          <StyledTabPanel>
            <mockChildComponent>Test Content</mockChildComponent>
          </StyledTabPanel>
        </ThemeProvider>
      );
      userEvent.resizeWindow(768 - 1, 768 - 1); // simulate mobile view
      expect(screen.getByText(/test content/i)).toHaveStyleRule('font-size', '13px');
    });
  });

  describe('Обработка событий', () => {
    it('should call onChange handler when tab selected', async () => {
      const onChangeMock = jest.fn();
      render(
        <ThemeProvider theme={theme}>
          <StyledTabPanel value="tab1" onChange={onChangeMock}>
            <mockChildComponent>Test Content</mockChildComponent>
          </StyledTabPanel>
        </ThemeProvider>
      );
      await waitFor(() => {
        userEvent.click(screen.getByRole('tab', { name: /tab 1/i }));
      });
      expect(onChangeMock).toHaveBeenCalledWith('tab1');
    });
  });

  describe('Вспомогательные компоненты', () => {
    it('should pass correct props to child components', () => {
      render(
        <ThemeProvider theme={theme}>
          <StyledTabPanel>
            <mockChildComponent />
          </StyledTabPanel>
        </ThemeProvider>
      );
      expect(screen.queryAllByRole('tab')).toHaveLength(1);
      expect(screen.queryAllByRole('menuitem')).toHaveLength(1);
    });
  });
});