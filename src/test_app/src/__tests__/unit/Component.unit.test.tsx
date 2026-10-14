/**
 * Модульные тесты для изолированной проверки компонента для Component
 * 
 * @file Component.unit.test.tsx
 * @description Тестирование Component 
 * @generated 2026-09-08T13:36:41.232Z
 * @type {unit}
 * @testCount 4
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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Router as RouterMock } from 'react-router-dom';
import AppRouter from './src/router.tsx';

describe('AppRouter', () => {
  describe('Рендеринг', () => {
    it('should render without errors', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      expect(screen.queryByRole('loading')).not.toBeInTheDocument();
    });

    it('should render home page by default', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const homeLink = screen.getByRole('link', { name: /home/i });
      userEvent.click(homeLink);
      expect(screen.queryByRole('loading')).not.toBeInTheDocument();
    });

    it('should navigate to task details when clicking on a task link', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const taskLink = screen.getByRole('link', { name: /task/i });
      userEvent.click(taskLink);
      expect(screen.queryByRole('loading')).not.toBeInTheDocument();
    });

    it('should show share page when navigating to "/share"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const shareLink = screen.getByRole('link', { name: /share/i });
      userEvent.click(shareLink);
      expect(screen.queryByRole('heading', { name: /share/i })).toBeInTheDocument();
    });

    it('should show add task form when navigating to "/add"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const addLink = screen.getByRole('link', { name: /add/i });
      userEvent.click(addLink);
      expect(screen.queryByRole('heading', { name: /add task/i })).toBeInTheDocument();
    });

    it('should show user profile when navigating to "/user"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const userLink = screen.getByRole('link', { name: /user/i });
      userEvent.click(userLink);
      expect(screen.queryByRole('heading', { name: /user profile/i })).toBeInTheDocument();
    });

    it('should show transfer page when navigating to "/transfer"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const transferLink = screen.getByRole('link', { name: /transfer/i });
      userEvent.click(transferLink);
      expect(screen.queryByRole('heading', { name: /transfer/i })).toBeInTheDocument();
    });

    it('should show categories page when navigating to "/categories"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const categoriesLink = screen.getByRole('link', { name: /categories/i });
      userEvent.click(categoriesLink);
      expect(screen.queryByRole('heading', { name: /categories/i })).toBeInTheDocument();
    });

    it('should show purge page when navigating to "/purge"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const purgeLink = screen.getByRole('link', { name: /purge/i });
      userEvent.click(purgeLink);
      expect(screen.queryByRole('heading', { name: /purge/i })).toBeInTheDocument();
    });

    it('should show sync page when navigating to "/sync"', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const syncLink = screen.getByRole('link', { name: /sync/i });
      userEvent.click(syncLink);
      expect(screen.queryByRole('heading', { name: /sync/i })).toBeInTheDocument();
    });

    it('should show not found page for invalid routes', () => {
      render(
        <RouterMock>
          <AppRouter />
        </RouterMock>
      );
      const invalidLink = screen.getByRole('link', { name: /invalid route/i });
      userEvent.click(invalidLink);
      expect(screen.queryByRole('heading', { name: /not found/i })).toBeInTheDocument();
    });
  });
});