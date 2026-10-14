/**
 * Модульные тесты для изолированной проверки компонента для TaskIcon
 * 
 * @file TaskIcon.unit.test.tsx
 * @description Тестирование TaskIcon 
 * @generated 2026-09-08T13:18:58.049Z
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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskIcon from '../TaskIcon';

describe('TaskIcon', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TaskIcon />);
      expect(screen.getByRole('img')).toBeInTheDocument();  
    });

    it('should render with custom scale prop', () => {
      render(<TaskIcon scale={2} />);
      expect(screen.getByRole('img').getAttribute('width')).toEqual('432');
      expect(screen.getByRole('img').getAttribute('height')).toEqual('868');
    });

    it('should render with custom color prop', () => {
      render(<TaskIcon color="#ff0000" />);
      expect(screen.getByRole('img').querySelector('circle')).toHaveStyle({stroke: '#ff0000'});
    });

    it('should render with different variants', () => {
      render(<TaskIcon variant='add' />);
      expect(screen.queryByRole('img')).toMatchSnapshot();

      render(<TaskIcon variant='error' />);
      expect(screen.queryByRole('img')).toMatchSnapshot();

      render(<TaskIcon variant='success' />);
      expect(screen.queryByRole('img')).toMatchSnapshot();
    });
  });

  describe('SVG Filter', () => {
    it('should apply glow effect when enabled', () => {
      render(<TaskIcon settings={{ enableGlow: true }} />);
      expect(screen.getByRole('img')).toHaveStyleContaining(
        'filter: drop-shadow(0px 0px'
      );
    });

    it('should not apply glow effect when disabled', () => {
      render(<TaskIcon settings={{ enableGlow: false }} />);
      expect(screen.getByRole('img')).not.toHaveStyleContaining(
        'drop-shadow'
      );
    });
  });
});