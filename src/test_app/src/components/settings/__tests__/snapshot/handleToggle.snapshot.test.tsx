/**
 * Snapshot-тесты для проверки рендеринга для handleToggle
 * 
 * @file handleToggle.snapshot.test.tsx
 * @description Тестирование handleToggle 
 * @generated 2026-09-08T13:20:17.046Z
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
import { UserContext } from '../../contexts/UserContext';  
import { createMemoryRouter } from 'react-router-dom';
import { renderHook } from '@testing-library/react-hooks';

// Mock UserContext for testing purposes
const mockUser = {
  settings: {
    someSetting: true
  },
  setUser: jest.fn()
};

jest.mock('../../contexts/UserContext', () => ({
  useContext: () => mockUser
}));

describe('handleToggle Snapshot Tests', () => {
  test('should match snapshot with default props', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when enabled and no text or reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" settingKey="someSetting" />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when enabled with text but no reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" text="Some Text" settingKey="someSetting" />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when enabled with both text and reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" text="Some Text" settingKey="someSetting" disabledReason="Disabled Reason" />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when disabled without reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" settingKey="someSetting" disabled />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when disabled with reason', () => {
    const tree = renderer.create(
      <UserContext.Provider value={{ user: mockUser, setUser: mockUser.setUser }}>
        <handleToggle header="Test Header" settingKey="someSetting" disabled disabledReason="Disabled Reason" />
      </UserContext.Provider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});