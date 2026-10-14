/**
 * Модульные тесты для изолированной проверки компонента для ProfileSidebar
 * 
 * @file ProfileSidebar.unit.test.tsx
 * @description Тестирование ProfileSidebar 
 * @generated 2026-09-07T22:47:30.747Z
 * @type {unit}
 * @testCount 9
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

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import { UserContext } from '../../contexts/UserContext';
import { createMemoryContext } from '../../__mocks__/createMemoryContext';

const mockUser = {
  name: 'John Doe',
  profilePicture: 'http://example.com/profile.jpg',
  tasks: [],
  settings: {},
};

const MockUserContext = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser, setUser: jest.fn() }}>
    {children}
  </UserContext.Provider>
);

describe('ProfileSidebar', () => {
  let user;

  beforeEach(() => {
    user = mockUser;
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const { container } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('displays user name and avatar', () => {
      const { getByText, getByRole } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(getByRole('button')).toHaveTextContent(/John Doe/);
      expect(getByRole('img')).toHaveAttribute('src', 'http://example.com/profile.jpg');
    });

    it('handles clicks on menu items', () => {
      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      fireEvent.click(getByText(/Tasks/));
      expect(getByText(/Tasks/)).toBeInTheDocument(); // ensure it's still visible after clicking

      fireEvent.click(getByText(/Add Task/));
      expect(getByText(/Add Task/)).toBeInTheDocument();

      fireEvent.click(getByText(/Categories/));
      expect(getByText(/Categories/)).toBeInTheDocument();

      fireEvent.click(getByText(/Purge Tasks/));
      expect(getByText(/Purge Tasks/)).toBeInTheDocument();

      fireEvent.click(getByText(/Transfer/));
      expect(getByText(/Transfer/)).toBeInTheDocument();

      fireEvent.click(getByText(/Sync Devices/));
      expect(getByText(/Sync Devices/)).toBeInTheDocument();

      fireEvent.click(getByText(/Report Issue/));
      expect(getByText(/Report Issue/)).toBeInTheDocument();

      fireEvent.click(getByText(/Buy me a coffee/));
      expect(getByText(/Buy me a coffee/)).toBeInTheDocument();

      fireEvent.click(getByText(/Install App/));
      expect(getByText(/Install App/)).toBeInTheDocument();

      fireEvent.click(getByText(/Logout/));
      expect(getByText(/Logout/)).toBeInTheDocument();
    });

    it('shows toast message when installing app', () => {
      const mockShowToast = jest.fn();
      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      fireEvent.click(getByText(/Install App/));
      waitFor(() => expect(mockShowToast).toHaveBeenCalledWith('App installed successfully!'));
    });

    it('displays correct number of stars and issues', () => {
      const mockRepoData = {
        stargazers_count: 100,
        open_issues_count: 5,
      };

      const mockFetchGitHubInfo = jest.fn().mockResolvedValue({
        repoData: mockRepoData,
        branchData: {},
      });

      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(getByText(/100 stars on Github/)).toBeInTheDocument();
      expect(getByText(/5 open issues/)).toBeInTheDocument();
    });

    it('displays last update information', () => {
      const mockLastUpdate = '2023-01-01T12:00:00Z';
      const mockUser = {
        ...mockUser,
        lastSyncedAt: mockLastUpdate,
      };

      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(getByText(/Last synced Jan 1, 2023 at 12:00 PM/)).toBeInTheDocument();
    });

    it('displays credits information', () => {
      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      expect(getByText(/Made with ❤️ by maciekt07/)).toBeInTheDocument();
    });
  });

  describe('Interaction with child components', () => {
    it('passes correct props to child components', () => {
      const { getByRole } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      const link = getByRole('link');
      expect(link.href).toEqual('/');
    });
  });

  describe('API calls', () => {
    it('makes correct API calls', async () => {
      const mockFetchGitHubInfo = jest.fn().mockResolvedValue({
        repoData: {
          stargazers_count: 100,
          open_issues_count: 5,
        },
        branchData: {},
      });

      const mockFetchBMCInfo = jest.fn().mockResolvedValue({
        supportersCount: 10,
      });

      const { getByText } = render(
        <MemoryRouter>
          <MockUserContext>
            <ProfileSidebar />
          </MockUserContext>
        </MemoryRouter>
      );

      await waitFor(() => expect(mockFetchGitHubInfo).toHaveBeenCalled());
      await waitFor(() => expect(mockFetchBMCInfo).toHaveBeenCalled());

      expect(getByText(/100 stars on Github/)).toBeInTheDocument();
      expect(getByText(/10 supporters on Buy me a coffee/)).toBeInTheDocument();
    });
  });
});

// Additional tests can be added here based on specific requirements or edge cases.