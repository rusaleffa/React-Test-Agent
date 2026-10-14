/**
 * Snapshot-тесты для проверки рендеринга для CustomDialogTitle
 * 
 * @file CustomDialogTitle.snapshot.test.tsx
 * @description Тестирование CustomDialogTitle 
 * @generated 2026-09-07T22:44:48.145Z
 * @type {snapshot}
 * @testCount 5
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

// Настройка темы для тестирования
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

describe('CustomDialogTitle Snapshot Tests', () => {
  // Базовый тест с пустыми пропсами и светлой темой
  test('should match snapshot with default props in light theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <CustomDialogTitle />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с подзаголовком и иконкой в светлой теме
  test('should match snapshot with subTitle and icon in light theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <CustomDialogTitle
            title='Test Title'
            subTitle='Test Subtitle'
            icon={<div>Test Icon</div>}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с отключенным делителем в темной теме
  test('should match snapshot without divider in dark theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <CustomDialogTitle
            title='Test Title'
            subTitle='Test Subtitle'
            removeDivider
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с кнопкой закрытия в светлой теме
  test('should match snapshot with close button in light theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <CustomDialogTitle
            title='Test Title'
            onClose={() => {}}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с кнопкой закрытия и делителем в темной теме
  test('should match snapshot with close button and divider in dark theme', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <CustomDialogTitle
            title='Test Title'
            onClose={() => {}}
            removeDivider={false}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});