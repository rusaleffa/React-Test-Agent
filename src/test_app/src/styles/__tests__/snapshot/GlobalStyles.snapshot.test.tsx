/**
 * Snapshot-тесты для проверки рендеринга для GlobalStyles
 * 
 * @file GlobalStyles.snapshot.test.tsx
 * @description Тестирование GlobalStyles 
 * @generated 2026-09-08T13:38:04.485Z
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
import { ThemeProvider } from '@emotion/react';
import { create } from 'jss';
import { JssProvider } from 'react-jss';
import { UserContext } from '../contexts/UserContext';
import { ColorPalette } from '../theme/themeConfig';
import { GlobalStyles } from './GlobalStyles';

const mockUser = {
  settings: {
    reduceMotion: 'system'
  }
};

const jss = create({
  insertionPoint: document.head
});

describe('GlobalStyles Snapshot Tests', () => {
  test('should match snapshot with default props and system reduce motion setting', () => {
    const tree = renderer
      .create(
        <JssProvider jss={jss}>
          <ThemeProvider theme={{ secondary: '#fff', primary: '#0070f3' }}>
            <UserContext.Provider value={{ user: mockUser }}>
              <GlobalStyles />
            </UserContext.Provider>
          </ThemeProvider>
        </JssProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with dark mode enabled and system reduce motion setting', () => {
    const tree = renderer
      .create(
        <JssProvider jss={jss}>
          <ThemeProvider theme={{ secondary: '#fff', primary: '#0070f3', darkmode: true }}>
            <UserContext.Provider value={{ user: mockUser }}>
              <GlobalStyles />
            </UserContext.Provider>
          </ThemeProvider>
        </JssProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with custom reduce motion setting off', () => {
    const tree = renderer
      .create(
        <JssProvider jss={jss}>
          <ThemeProvider theme={{ secondary: '#fff', primary: '#0070f3' }}>
            <UserContext.Provider value={{ user: { settings: { reduceMotion: false } } }}>
              <GlobalStyles />
            </UserContext.Provider>
          </ThemeProvider>
        </JssProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with custom reduce motion setting on', () => {
    const tree = renderer
      .create(
        <JssProvider jss={jss}>
          <ThemeProvider theme={{ secondary: '#fff', primary: '#0070f3' }}>
            <UserContext.Provider value={{ user: { settings: { reduceMotion: true } } }}>
              <GlobalStyles />
            </UserContext.Provider>
          </ThemeProvider>
        </JssProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});