/**
 * Модульные тесты для изолированной проверки компонента для AboutTab
 * 
 * @file AboutTab.unit.test.tsx
 * @description Тестирование AboutTab 
 * @generated 2026-09-08T13:21:43.580Z
 * @type {unit}
 * @testCount 3
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
import AboutTab from '../AboutTab';

describe('AboutTab', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<AboutTab />);

      expect(screen.getByText(/a simple todo app project/i)).toBeInTheDocument();
      expect(screen.getByAltText('Todo App Screenshot')).toBeInTheDocument();
      expect(
        screen.queryByText(/created by maciekt07/i)
      ).not.toBeNull(); // Проверяем наличие ссылки на автора проекта
      expect(
        screen.queryByText(/explore the project on github/i)
      ).not.toBeNull(); // Проверяем ссылку на репозиторий проекта
    });

    it('should show storage usage when available', () => {
      render(<AboutTab storageUsage={1024 * 1024 * 5} />); // симулируем использование хранилища в 5MB

      expect(screen.getByText(/storage usage/i)).toBeInTheDocument();
      expect(screen.getByText(/5.00 mb/i)).toBeInTheDocument();
    });

    it('should not show storage usage if unavailable or zero', () => {
      render(<AboutTab storageUsage={null} />);
      render(<AboutTab storageUsage={0} />);

      expect(screen.queryByText(/storage usage/i)).toBeNull();
    });
  });
});

// Дополнительные тесты можно добавить здесь, если потребуется проверка других аспектов работы компонента