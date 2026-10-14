/**
 * Snapshot-тесты для проверки рендеринга для TaskSort
 * 
 * @file TaskSort.snapshot.test.tsx
 * @description Тестирование TaskSort 
 * @generated 2026-09-08T13:26:51.805Z
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
import TaskSort from './TaskSort';

// Создаем тему с темным и светлым режимом
const lightTheme = createTheme({
  secondary: '#fff',
  primary: '#0077ff'
});
const darkTheme = createTheme({
  secondary: '#000',
  primary: '#0077ff'
});

describe('TaskSort Snapshot Tests', () => {
  // Тестируем базовый случай без пропсов
  test('should match snapshot without props', () => {
    const tree = renderer.create(
      <ThemeProvider theme={lightTheme}>
        <TaskSort />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай со значением sortOption
  test('should match snapshot with sortOption prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={lightTheme}>
        <TaskSort sortOption="dateCreated" />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай в режиме moveMode
  test('should match snapshot in moveMode', () => {
    const tree = renderer.create(
      <ThemeProvider theme={lightTheme}>
        <TaskSort moveMode={true} />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай в темном режиме
  test('should match snapshot in dark mode', () => {
    const tree = renderer.create(
      <ThemeProvider theme={darkTheme}>
        <TaskSort />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай в темном режиме и со значением sortOption
  test('should match snapshot in dark mode with sortOption', () => {
    const tree = renderer.create(
      <ThemeProvider theme={darkTheme}>
        <TaskSort sortOption="dateCreated" />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тестируем случай в темном режиме и в режиме moveMode
  test('should match snapshot in dark mode and moveMode', () => {
    const tree = renderer.create(
      <ThemeProvider theme={darkTheme}>
        <TaskSort moveMode={true} />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});