/**
 * Модульные тесты для изолированной проверки компонента для UnstyledButton
 * 
 * @file UnstyledButton.unit.test.tsx
 * @description Тестирование UnstyledButton 
 * @generated 2026-09-07T22:45:35.043Z
 * @type {unit}
 * @testCount 6
 * 
 * @dependencies @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D @testing-library/jest-dom
// npm install -D @testing-library/user-event

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import { UserContext } from '../contexts/UserContext';
import { createMemoryContext } from '../__mocks__/createMemoryContext';

jest.mock('../utils/showToast');

const mockUser = {
  tasks: [],
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={mockUser}>{children}</UserContext.Provider>
);

describe('ErrorBoundary', () => {
  let mockError;

  beforeEach(() => {
    mockError = new Error('Test error message');
  });

  describe('Rendering', () => {
    it('renders without error when no error occurs', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );
      expect(screen.getByText(/hello world/i)).toBeInTheDocument();
    });

    it('renders error boundary when an error occurs', () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      expect(screen.getByText(/oops! an error occurred/i)).toBeInTheDocument();
    });

    function throwError() {
      throw mockError;
    }
  });

  describe('Handling Errors', () => {
    it('displays error details', async () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      await waitFor(() => screen.getByText(mockError.name));
      await waitFor(() => screen.getByText(mockError.message));
    });

    it('shows alert about losing data', async () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      await waitFor(() =>
        screen.getByText(/by cleaning app data, you will lose all of your tasks/i),
      );
    });

    it('handles auto-clear dialog', async () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      userEvent.click(screen.getByText(/auto clear/i));
      await waitFor(() => screen.getByRole('dialog'));

      userEvent.click(screen.getByText(/confirm/i));
      expect(localStorage.clear).toHaveBeenCalled();
      expect(sessionStorage.clear).toHaveBeenCalled();
      expect(location.reload).toHaveBeenCalled();
    });

    it('exports tasks to json', async () => {
      render(
        <MemoryRouter>
          <MockUserContext>
            <ErrorBoundary>
              <p>Hello World</p>
              {throwError()}
            </ErrorBoundary>
          </MockUserContext>
        </MemoryRouter>
      );

      userEvent.click(screen.getByText(/export tasks to json/i));
      expect(showToast).toHaveBeenCalledWith('Exported all tasks (0)');
    });
  });
});

// Mock for showToast
function showToast(message, options) {
  console.log(`${message}, ${options}`);
}