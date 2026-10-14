/**
 * Snapshot-тесты для проверки рендеринга для TaskManagementContainer
 * 
 * @file TaskManagementContainer.snapshot.test.tsx
 * @description Тестирование TaskManagementContainer 
 * @generated 2026-09-08T13:39:17.601Z
 * @type {snapshot}
 * @testCount 6
 * 
 * @dependencies @testing-library/react, react-test-renderer
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D react-test-renderer

import renderer from 'react-test-renderer';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    primary: '#ff7961',
    secondary: '#4caf50',
    darkmode: false,
  },
});

const darkTheme = createTheme({
  palette: {
    primary: '#ff7961',
    secondary: '#4caf50',
    darkmode: true,
  },
});

describe('TaskManagementContainer Snapshot Tests', () => {
  // Light mode tests
  describe('Light Mode', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(
        <ThemeProvider theme={lightTheme}>
          <TaskManagementContainer />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with selected prop', () => {
      const tree = renderer.create(
        <ThemeProvider theme={lightTheme}>
          <TaskManagementContainer selected />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with different background color', () => {
      const tree = renderer.create(
        <ThemeProvider theme={lightTheme}>
          <TaskManagementContainer backgroundClr="#f0f0f0" />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // Dark mode tests
  describe('Dark Mode', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer.create(
        <ThemeProvider theme={darkTheme}>
          <TaskManagementContainer />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with selected prop', () => {
      const tree = renderer.create(
        <ThemeProvider theme={darkTheme}>
          <TaskManagementContainer selected />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should match snapshot with different background color', () => {
      const tree = renderer.create(
        <ThemeProvider theme={darkTheme}>
          <TaskManagementContainer backgroundClr="#f0f0f0" />
        </ThemeProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});