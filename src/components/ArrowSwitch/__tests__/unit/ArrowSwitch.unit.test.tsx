/**
 * Модульные тесты для изолированной проверки компонента для ArrowSwitch
 * 
 * @file ArrowSwitch.unit.test.tsx
 * @description Тестирование ArrowSwitch 
 * @generated 2026-09-07T22:12:54.156Z
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
import ArrowSwitch from '../ArrowSwitch';

describe('ArrowSwitch', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<ArrowSwitch checked={false} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByTestId('arrow-icon')).toBeInTheDocument();
      expect(
        screen.getByRole('button').querySelector('svg')
      ).toHaveAttribute('transform', 'rotate(180deg)');
    });

    it('should render with checked prop', () => {
      render(<ArrowSwitch checked={true} />);
      expect(screen.getByRole('button').querySelector('svg'))
        .toHaveAttribute('transform', 'rotate(0deg)');
    });
  });

  describe('Обработка событий', () => {
    let component;

    beforeEach(() => {
      component = render(<ArrowSwitch checked={false} />);
    });

    it('should toggle state on click', async () => {
      await userEvent.click(screen.getByRole('button'));
      expect(component.container.querySelector('svg')).toHaveAttribute(
        'transform',
        'rotate(0deg)'
      );
    });
  });
});