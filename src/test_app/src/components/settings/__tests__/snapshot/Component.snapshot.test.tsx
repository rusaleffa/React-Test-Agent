/**
 * Snapshot-тесты для проверки рендеринга для Component
 * 
 * @file Component.snapshot.test.tsx
 * @description Тестирование Component 
 * @generated 2026-09-08T13:21:09.577Z
 * @type {snapshot}
 * @testCount 4
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
import { createTheme } from '@mui/material/core/ThemeProvider';

// Пример темы для тестирования
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  darkmode: false,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  darkmode: true,
});

describe('ShortcutItem Snapshots', () => {
  // Светлая тема
  test('should match snapshot in light theme with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <ShortcutItem name="Test Name" keys={['Cmd', 'Shift', 'A']} />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in light theme with custom description', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={lightTheme}>
          <ShortcutItem
            name="Test Name"
            description="This is a test description."
            keys={['Cmd', 'Shift', 'A']}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Темная тема
  test('should match snapshot in dark theme with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <ShortcutItem name="Test Name" keys={['Cmd', 'Shift', 'A']} />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot in dark theme with custom description', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={darkTheme}>
          <ShortcutItem
            name="Test Name"
            description="This is a test description."
            keys={['Cmd', 'Shift', 'A']}
          />
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});