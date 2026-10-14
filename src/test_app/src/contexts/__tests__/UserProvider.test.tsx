import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserContextProvider } from '../UserContextProvider';
import { UserContext } from '../contexts/UserContext';

describe('UserContextProvider', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<UserContextProvider />);
      expect(screen.queryByRole('user')).toBeNull();
    });

    it('should pass correct context to child components', () => {
      const ChildComponent = () => (
        <UserContext.Consumer>
          {(value) => <div data-testid="child-component" {...value} />}
        </UserContext.Consumer>
      );

      render(
        <UserContextProvider>
          <ChildComponent />
        </UserContextProvider>
      );

      const childElement = screen.getByTestId('child-component');
      expect(childElement).toHaveAttribute('data-user', JSON.stringify({ user: defaultUser }));
    });
  });
});

// ============================================
// SNAPSHOT TESTS
// Файл: UserContextProvider.snapshot.test.tsx
// Описание: Snapshot-тесты для проверки рендеринга для UserContextProvider
// ============================================
import renderer from 'react-test-renderer';
import { UserContextProvider } from './UserContextProvider';

describe('UserContextProvider Snapshot Tests', () => {
  // Тест без пропсов и начального значения state
  test('should match snapshot without props and initial state', () => {
    const tree = renderer.create(<UserContextProvider />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с пропсом children
  test('should match snapshot with children prop', () => {
    const tree = renderer.create(
      <UserContextProvider>
        <div>Test Child</div>
      </UserContextProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Тест с пропсами и измененным состоянием user
  test('should match snapshot when user is updated', () => {
    const newUser = { id: 1, name: 'John Doe' };
    const tree = renderer.create(
      <UserContextProvider>
        <UserContext.Provider value={{ user: newUser, setUser: jest.fn() }}>
          <div>Test Child</div>
        </UserContext.Provider>
      </UserContextProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
