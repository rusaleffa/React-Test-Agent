/**
 * Snapshot-тесты для проверки рендеринга для Container
 * 
 * @file Container.snapshot.test.tsx
 * @description Тестирование Container 
 * @generated 2026-09-08T13:37:02.913Z
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
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/core';

const theme = createTheme({
  primary: '#ffc107',
  secondary: '#3f51b5'
});

describe('Container Snapshot Tests', () => {
  // Базовый снапшот без пропсов
  test('should match snapshot without props', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Снапшот с пропсом disabled на true
  test('should match snapshot with disabled prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container disabled />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Снапшот с пропсом disabled на false
  test('should match snapshot with enabled prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container />
      </ThemeProvider>
    ).toJSON(); // Повторно используем базовый вариант
    expect(tree).toMatchSnapshot();
  });

  // Снапшот с пропсом helpercolor
  test('should match snapshot with helpercolor prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container>
          <StyledInput helpercolor="#ff0000" />
        </Container>
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Снапшот с пропсом hidetext
  test('should match snapshot with hidetext prop', () => {
    const tree = renderer.create(
      <ThemeProvider theme={theme}>
        <Container>
          <StyledInput hidetext />
        </Container>
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});