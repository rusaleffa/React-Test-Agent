/**
 * Модульные тесты для изолированной проверки компонента для BottomNav
 * 
 * @file BottomNav.unit.test.tsx
 * @description Тестирование BottomNav 
 * @generated 2026-09-07T22:43:01.035Z
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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BottomNav from '../BottomNav';
import { UserContext } from '../contexts/UserContext';
import { MemoryRouter } from 'react-router-dom';

const mockUser = {
  user: {
    tasks: [
      { id: 1, done: false },
      { id: 2, done: true },
    ],
    settings: {
      enableGlow: true,
      enableCategories: true,
    },
  },
};

const MockUserProvider = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser }}>
    {children}
  </UserContext.Provider>
);

describe('BottomNav', () => {
  describe('Рендеринг', () => {
    it('should render without errors', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      expect(screen.queryByRole('navigation')).toBeInTheDocument();
    });

    it('should render with different routes', async () => {
      render(
        <MemoryRouter initialEntries={['/categories']} initialIndex={0}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.queryByText(/categories/i)).toBeInTheDocument();
      });
    });

    it('should render add button when no tasks', () => {
      render(
        <MemoryRouter initialEntries={['/add']} initialIndex={0}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      expect(screen.queryByText(/add/i)).toBeInTheDocument();
    });

    it('should not render add button when tasks exist', () => {
      render(
        <MemoryRouter initialEntries={['/task']} initialIndex={0}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      expect(screen.queryByText(/add/i)).not.toBeInTheDocument();
    });
  });

  describe('Обработка кликов', () => {
    it('should navigate to task page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /tasks/i }));
      expect(window.location.href).toEqual('/task');
    });

    it('should navigate to categories page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /categories/i }));
      expect(window.location.href).toEqual('/categories');
    });

    it('should navigate to add page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /add/i }));
      expect(window.location.href).toEqual('/add');
    });

    it('should navigate to transfer page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /transfer/i }));
      expect(window.location.href).toEqual('/transfer');
    });

    it('should navigate to profile page', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <MockUserProvider>
            <BottomNav />
          </MockUserProvider>
        </MemoryRouter>
      );
      userEvent.click(screen.getByRole('button', { name: /profile/i }));
      expect(window.location.href).toEqual('/user');
    });
  });
});

// Дополнительные тесты можно добавить здесь, например, проверку анимации или стилей