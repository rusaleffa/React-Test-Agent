/**
 * Модульные тесты для изолированной проверки компонента для CategoriesContainer
 * 
 * @file CategoriesContainer.unit.test.tsx
 * @description Тестирование CategoriesContainer 
 * @generated 2026-09-08T13:37:22.500Z
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
import CategoriesContainer from '../CategoriesContainer';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/core';

const mockTheme = createTheme({
  palette: {
    primary: '#ff0000',
    secondary: '#00ff00',
    darkmode: false,
  },
});

describe('CategoriesContainer', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      expect(screen.getByRole('category')).toBeInTheDocument();
    });

    it('should render with dark mode enabled', () => {
      render(
        <ThemeProvider theme={createTheme({ palette: { darkmode: true } })}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      expect(screen.getByRole('category')).toHaveStyle({
        background: '#0000005a',
      });
    });
  });

  describe('Обработка событий', () => {
    it('should handle click event on add category button', async () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      const addCategoryButton = screen.getByRole('button', { name: /add category/i });
      await userEvent.click(addCategoryButton);
      expect(addCategoryButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should update input value when typing in edit name input', async () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      const editNameInput = screen.getByLabelText(/edit name/i);
      await userEvent.type(editNameInput, 'Test Category');
      expect(editNameInput).toHaveValue('Test Category');
    });
  });

  describe('Взаимодействие с дочерними элементами', () => {
    it('should pass correct props to child components', () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <CategoriesContainer />
        </ThemeProvider>
      );
      const categoryElement = screen.getByRole('category');
      expect(categoryElement).toHaveStyle({
        background: mockTheme.palette.primary,
        color: mockTheme.palette.secondary,
      });
    });
  });
});

// Примеры моков для дочерних компонентов можно добавить здесь, если они необходимы