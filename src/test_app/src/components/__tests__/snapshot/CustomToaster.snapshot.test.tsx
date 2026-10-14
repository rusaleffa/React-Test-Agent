/**
 * Snapshot-тесты для проверки рендеринга для CustomToaster
 * 
 * @file CustomToaster.snapshot.test.tsx
 * @description Тестирование CustomToaster 
 * @generated 2026-09-08T13:19:19.700Z
 * @type {snapshot}
 * @testCount 3
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
import { UserContext } from '../contexts/UserContext';
import { createUserContext } from '../__mocks__/UserContext.mock';
import { Theme } from '../theme/themeConfig';

// Mocking the UserContext for testing purposes
const mockUserContext = createUserContext({ settings: { reduceMotion: false } });

describe('CustomToaster Snapshot Tests', () => {
  // Test with default props and no context
  test('should match snapshot with default props', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={Theme}>
          <UserContext.Provider value={mockUserContext}>
            <CustomToaster />
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Test with reduced motion enabled in context
  test('should match snapshot with reduced motion enabled', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={Theme}>
          <UserContext.Provider value={createUserContext({ settings: { reduceMotion: true } })}>
            <CustomToaster />
          </UserContext.Provider>
        </ThemeProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Test with mobile layout
  test('should match snapshot on mobile layout', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={Theme}>
          <UserContext.Provider value={mockUserContext}>
            <CustomToaster />
          </UserContext.Provider>
        </ThemeProvider>,
        { createNodeMock: () => ({ offsetWidth: 320 }) }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});