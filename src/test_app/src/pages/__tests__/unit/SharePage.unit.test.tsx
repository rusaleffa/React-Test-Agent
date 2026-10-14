/**
 * Модульные тесты для изолированной проверки компонента для SharePage
 * 
 * @file SharePage.unit.test.tsx
 * @description Тестирование SharePage 
 * @generated 2026-09-08T13:33:50.533Z
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

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SharePage from '../src/pages/Share.tsx';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../src/contexts/UserContext';
import { createMemoryContext } from './testUtils';

// Мокаем внешние зависимости
jest.mock('@mui/material', () => ({ /* mocks */ }));
jest.mock('@mui/icons-material', () => ({ /* mocks */ }));
jest.mock('../src/utils', () => ({ /* mocks */ }));

const mockUser = {
  categories: [],
  tasks: []
};

const mockSetUser = jest.fn();

const contextValue = createMemoryContext(UserContext, { user: mockUser, setUser: mockSetUser });

describe('SharePage', () => {
  describe('Рендеринг', () => {
    it('should render without errors', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.queryByTestId('root')).toBeInTheDocument();
    });

    it('should display alert when task is invalid', async () => {
      render(
        <MemoryRouter initialEntries={['/share?task=invalid']}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Invalid task or category color format./));
    });

    it('should display dialog with task details', async () => {
      const validTask = '{"name":"Valid Task","description":"Description","color": "#FF0000"}';
      render(
        <MemoryRouter initialEntries={['/share?task=' + encodeURIComponent(validTask)]}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Valid Task/));
    });

    it('should display error message for malformed task', async () => {
      render(
        <MemoryRouter initialEntries={['/share?task=malformed']}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Failed to decode task data./));
    });
  });

  describe('Обработка действий пользователя', () => {
    it('should navigate back after adding task', async () => {
      const validTask = '{"name":"Valid Task","description":"Description","color": "#FF0000"}';
      render(
        <MemoryRouter initialEntries={['/share?task=' + encodeURIComponent(validTask)]}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Valid Task/));
      userEvent.click(screen.getByText(/Add Task/));
      await waitFor(() => expect(mockSetUser).toHaveBeenCalled());
      expect(window.location.pathname).toEqual('/');
    });

    it('should decline task and navigate back', async () => {
      render(
        <MemoryRouter initialEntries={['/share?task=valid']}>
          <UserContext.Provider value={contextValue}>
            <SharePage />
          </UserContext.Provider>
        </MemoryRouter>
      );
      await waitFor(() => screen.getByText(/Decline/));
      userEvent.click(screen.getByText(/Decline/));
      await waitFor(() => expect(window.location.pathname).toEqual('/'));
    });
  });
});