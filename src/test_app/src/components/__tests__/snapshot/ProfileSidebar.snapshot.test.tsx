/**
 * Snapshot-тесты для проверки рендеринга для ProfileSidebar
 * 
 * @file ProfileSidebar.snapshot.test.tsx
 * @description Тестирование ProfileSidebar 
 * @generated 2026-09-07T22:47:30.749Z
 * @type {snapshot}
 * @testCount 9
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
import { createMemoryRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Theme } from '../theme/themeConfig';
import { ProfileSidebar } from '.';

describe('ProfileSidebar Snapshot Tests', () => {
  let userProps;

  // Настройка контекста и маршрутов перед каждым тестом
  beforeEach(() => {
    userProps = {
      user: {
        name: 'John Doe',
        profilePicture: 'example.jpg',
        tasks: [],
        settings: {},
      },
      setUser: jest.fn(),
    };
  });

  describe('Default Props', () => {
    test('should match snapshot with default props', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={userProps}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Loading State', () => {
    test('should match loading state snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, loading: true } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Error State', () => {
    test('should match error state snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, error: 'An error occurred' } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Empty Data', () => {
    test('should match empty data snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, tasks: [] } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Full Data', () => {
    test('should match full data snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, tasks: ['Task 1', 'Task 2'] } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Dark Mode', () => {
    test('should match dark mode snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, darkmode: true } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Different Name', () => {
    test('should match different name snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, name: 'Jane Smith' } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Different Avatar', () => {
    test('should match different avatar snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, profilePicture: 'different.jpg' } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Different Settings', () => {
    test('should match different settings snapshot', () => {
      const tree = renderer
        .create(
          <BrowserRouter>
            <ThemeProvider theme={Theme}>
              <UserContext.Provider value={{ ...userProps, user: { ...userProps.user, settings: { enableCategories: true } } }}>
                <ProfileSidebar />
              </UserContext.Provider>
            </ThemeProvider>
          </BrowserRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});