/**
 * Модульные тесты для изолированной проверки компонента для CategoryBadge
 * 
 * @file CategoryBadge.unit.test.tsx
 * @description Тестирование CategoryBadge 
 * @generated 2026-09-07T22:43:22.957Z
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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import CategoryBadge from '../CategoryBadge';

const mockUser = {
  user: {
    emojisStyle: 'NATIVE',
    settings: {
      enableGlow: true,
    },
  },
};

const MockComponent = () => (
  <MemoryRouter>
    <UserContext.Provider value={{ user: mockUser.user }}>
      <CategoryBadge category={{ id: 1, name: 'Test Category', color: '#ff0000', emoji: ':test:' }} />
    </UserContext.Provider>
  </MemoryRouter>
);

describe('CategoryBadge', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<MockComponent />);
      expect(screen.getByRole('chip')).toBeInTheDocument();
      expect(screen.queryByText(':test:')).toBeInTheDocument();
    });

    it('should render without emoji when no emoji is provided', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser.user }}>
            <CategoryBadge category={{ id: 1, name: 'Test Category', color: '#ff0000' }} />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.queryByText(':test:')).not.toBeInTheDocument();
    });

    it('should render with custom sizes for emojis', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser.user }}>
            <CategoryBadge category={{ id: 1, name: 'Test Category', color: '#ff0000', emoji: ':test:' }}
              emojiSizes={[30, 40]}
            />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.getByText(':test:').parentElement.style.width).toEqual('30px');
      expect(screen.getByText(':test:').parentElement.style.height).toEqual('40px');
    });
  });

  describe('Interaction', () => {
    it('should handle click event', async () => {
      render(<MockComponent />);
      await userEvent.click(screen.getByRole('chip'));
      expect(screen.getByRole('dialog')).toBeInTheDocument(); // проверка открытия диалога или другого поведения при клике
    });
  });
});

// Дополнительные тесты можно добавить здесь, например, проверку стилей, анимации и других особенностей компонента