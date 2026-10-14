/**
 * Snapshot-тесты для проверки рендеринга для GreetingHeader
 * 
 * @file GreetingHeader.snapshot.test.tsx
 * @description Тестирование GreetingHeader 
 * @generated 2026-09-08T13:38:26.297Z
 * @type {snapshot}
 * @testCount 8
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
import { GreetingHeader } from './GreetingHeader'; // Импортируйте компонент здесь

const lightTheme = createTheme({
  palette: {
    primary: '#ff5a5f',
    secondary: '#00acc1'
  },
  typography: {},
  shape: {}
});

const darkTheme = createTheme({
  palette: {
    primary: '#ff5a5f',
    secondary: '#00acc1'
  },
  typography: {},
  shape: {},
  direction: 'ltr',
  overrides: {}
});

describe('GreetingHeader Snapshot Tests', () => {
  test('should match snapshot in light mode with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <GreetingHeader />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark mode with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <GreetingHeader />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in light mode with tasks count prop', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <GreetingHeader tasksCount={{ count: 10 }} />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark mode with tasks count prop', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <GreetingHeader tasksCount={{ count: 10 }} />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in light mode with task completion percentage', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <GreetingHeader taskCompletionPercentage={75} />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark mode with task completion percentage', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <GreetingHeader taskCompletionPercentage={75} />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in light mode with offline status', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <GreetingHeader offline />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark mode with offline status', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <GreetingHeader offline />
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Добавьте дополнительные тесты для других сценариев и состояний компонента
});