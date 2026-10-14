/**
 * Snapshot-тесты для проверки рендеринга для EmojiTab
 * 
 * @file EmojiTab.snapshot.test.tsx
 * @description Тестирование EmojiTab 
 * @generated 2026-09-08T13:22:36.928Z
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
import { UserContext } from '../../../contexts/UserContext';
import { createMemoryRouter } from 'react-router-dom';
import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { EmojiTab } from './index';

// Mock store and context
const mockStore = configureStore([thunk]);
const initialState = {
  user: {
    darkmode: true,
    emojisStyle: 'NATIVE',
    settings: {},
  },
};

const mockUserContext = {
  user: initialState.user,
  setUser: jest.fn(),
};

describe('EmojiTab Snapshot Tests', () => {
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('should match snapshot with default props', () => {
    const component = (
      <Provider store={store}>
        <UserContext.Provider value={mockUserContext}>
          <createMemoryRouter>
            <EmojiTab />
          </createMemoryRouter>
        </UserContext.Provider>
      </Provider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with online status', () => {
    const updatedUser = {
      ...initialState.user,
      darkmode: false,
      emojisStyle: 'FACEBOOK',
    };
    const updatedMockUserContext = {
      user: updatedUser,
      setUser: jest.fn(),
    };

    act(() => {
      renderHook(() => useOnlineStatus(), { initialProps: {} });
    });

    const component = (
      <Provider store={store}>
        <UserContext.Provider value={updatedMockUserContext}>
          <createMemoryRouter>
            <EmojiTab />
          </createMemoryRouter>
        </UserContext.Provider>
      </Provider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with offline status', () => {
    const updatedUser = {
      ...initialState.user,
      darkmode: false,
      emojisStyle: 'FACEBOOK',
    };
    const updatedMockUserContext = {
      user: updatedUser,
      setUser: jest.fn(),
    };

    act(() => {
      renderHook(() => useOnlineStatus(), { initialProps: {} });
    });

    const component = (
      <Provider store={store}>
        <UserContext.Provider value={updatedMockUserContext}>
          <createMemoryRouter>
            <EmojiTab />
          </createMemoryRouter>
        </UserContext.Provider>
      </Provider>
    );

    // Simulate offline status
    global.navigator.onLine = false;

    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot with no emoji data', () => {
    const updatedUser = {
      ...initialState.user,
      darkmode: false,
      emojisStyle: 'FACEBOOK',
    };
    const updatedMockUserContext = {
      user: updatedUser,
      setUser: jest.fn(),
    };

    act(() => {
      renderHook(() => useOnlineStatus(), { initialProps: {} });
    });

    const component = (
      <Provider store={store}>
        <UserContext.Provider value={updatedMockUserContext}>
          <createMemoryRouter>
            <EmojiTab />
          </createMemoryRouter>
        </UserContext.Provider>
      </Provider>
    );

    // Remove emoji data
    localStorage.removeItem('epr_suggested');

    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});