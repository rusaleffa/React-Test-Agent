/**
 * Модульные тесты для изолированной проверки компонента для UserProfile
 * 
 * @file UserProfile.unit.test.tsx
 * @description Тестирование UserProfile 
 * @generated 2026-09-08T13:36:16.655Z
 * @type {unit}
 * @testCount 8
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

import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import UserProfile from './UserProfile';
import { UserContext } from '../contexts/UserContext';
import { createMemoryContext } from '../test_utils';

const mockUser = {
  name: 'John Doe',
  profilePicture: 'LOCAL_FILE_abc123',
  createdAt: '2023-01-01T12:00:00Z'
};

const mockContextValue = {
  user: mockUser,
  setUser: jest.fn()
};

const MockUserContext = createMemoryContext(UserContext, mockContextValue);

describe('UserProfile', () => {
  let userProfileComponent;

  beforeEach(() => {
    userProfileComponent = (
      <MockUserContext>
        <MemoryRouter>
          <UserProfile />
        </MemoryRouter>
      </MockUserContext>
    );
  });

  it('renders correctly with default props', () => {
    render(userProfileComponent);

    expect(screen.getByText(/User John Doe/i)).toBeInTheDocument();
    expect(screen.getByTestId('top-bar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Settings/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /John Doe/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Add Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save name/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('updates user name when valid input is provided', async () => {
    render(userProfileComponent);

    const input = screen.getByLabelText(/Add Name/i);
    userEvent.type(input, 'Jane Doe');

    fireEvent.click(screen.getByRole('button', { name: /Save name/i }));

    await waitFor(() => {
      expect(mockContextValue.setUser).toHaveBeenCalledWith({
        ...mockUser,
        name: 'Jane Doe'
      });
    });
  });

  it('does not update user name when invalid input is provided', async () => {
    render(userProfileComponent);

    const input = screen.getByLabelText(/Add Name/i);
    userEvent.type(input, 'a'.repeat(USER_NAME_MAX_LENGTH + 1)); // Exceeds limit

    fireEvent.click(screen.getByRole('button', { name: /Save name/i }));

    await waitFor(() => {
      expect(mockContextValue.setUser).not.toHaveBeenCalled();
    });
  });

  it('displays warning alert when profile picture is broken', async () => {
    render(userProfileComponent);

    // Simulate a broken profile picture scenario
    mockContextValue.user.profilePicture = 'BAD_PROFILE_PIC';

    await waitFor(() => {
      expect(screen.queryByText(/Profile picture might be broken/i)).toBeInTheDocument();
    });
  });

  it('opens and closes change image dialog', async () => {
    render(userProfileComponent);

    const button = screen.getByRole('button', { name: /Change or delete profile picture/i });
    userEvent.click(button);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('uploads profile picture via file upload', async () => {
    render(userProfileComponent);

    const fileInput = screen.getByRole('button', { name: /Upload from file/i });
    userEvent.upload(fileInput, new File(['test'], 'test.jpg', { type: 'image/jpeg' }));

    await waitFor(() => {
      expect(mockContextValue.setUser).toHaveBeenCalledWith({
        ...mockUser,
        profilePicture: 'NEW_PROFILE_PIC_ID'
      });
    });
  });

  it('deletes profile picture', async () => {
    render(userProfileComponent);

    const deleteButton = screen.getByRole('button', { name: /Remove Profile Picture/i });
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockContextValue.setUser).toHaveBeenCalledWith({
        ...mockUser,
        profilePicture: null
      });
    });
  });

  it('handles logout click', async () => {
    render(userProfileComponent);

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    userEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockContextValue.setUser).toHaveBeenCalledWith(null);
    });
  });
});

// Helper function to create memory context
function createMemoryContext(contextType, initialValue) {
  return {
    Provider: ({ children }) => <contextType.Provider value={initialValue}>{children}</contextType.Provider>,
  };
}