/**
 * Snapshot-тесты для проверки рендеринга для AppearanceTab
 * 
 * @file AppearanceTab.snapshot.test.tsx
 * @description Тестирование AppearanceTab 
 * @generated 2026-09-08T13:22:10.179Z
 * @type {snapshot}
 * @testCount 10
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
import { UserContext } from '../../../contexts/UserContext';
import { ThemeProvider } from '@emotion/react';
import { create } from 'jss';
import { jssPreset } from '@material-ui/core/styles';
import { MuiTheme } from '../../../theme/createTheme';

// Настройка JSS и Material UI
const jss = create(jssPreset());

describe('AppearanceTab Snapshot Tests', () => {
  let userContext;

  beforeEach(() => {
    userContext = {
      user: {
        darkmode: 'auto',
        theme: 'system',
        settings: {
          reduceMotion: 'system'
        }
      },
      setUser: jest.fn()
    };
  });

  test('should match snapshot with default props', () => {
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when dark mode is auto', () => {
    userContext.user.darkmode = 'auto';
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when dark mode is light', () => {
    userContext.user.darkmode = 'light';
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when dark mode is dark', () => {
    userContext.user.darkmode = 'dark';
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when dark mode is system', () => {
    userContext.user.darkmode = 'system';
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when theme is system', () => {
    userContext.user.theme = 'system';
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when theme is custom', () => {
    userContext.user.theme = 'custom';
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when reduce motion is system', () => {
    userContext.user.settings.reduceMotion = 'system';
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when reduce motion is always', () => {
    userContext.user.settings.reduceMotion = 'on';
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when reduce motion is never', () => {
    userContext.user.settings.reduceMotion = 'off';
    const component = (
      <ThemeProvider jss={jss} theme={MuiTheme}>
        <UserContext.Provider value={userContext}>
          <AppearanceTab />
        </UserContext.Provider>
      </ThemeProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});