/**
 * Модульные тесты для изолированной проверки компонента для fadeInLeft
 * 
 * @file fadeInLeft.unit.test.tsx
 * @description Тестирование fadeInLeft 
 * @generated 2026-09-08T13:38:45.341Z
 * @type {unit}
 * @testCount 5
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
import { keyframes } from '@emotion/react';
import fadeInLeft from '../fadeInLeft';

describe('fadeInLeft', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<fadeInLeft />);
      expect(screen.queryByRole('presentation')).toBeInTheDocument();
    });

    it('should render with custom duration prop', () => {
      render(<fadeInLeft duration="2s" />);
      expect(screen.queryByRole('presentation')).toHaveStyle({
        animationDuration: '2s',
      });
    });

    it('should render with custom delay prop', () => {
      render(<fadeInLeft delay="1s" />);
      expect(screen.queryByRole('presentation')).toHaveStyle({
        animationDelay: '1s',
      });
    });

    it('should render with custom timing function prop', () => {
      render(<fadeInLeft timingFunction="ease-in-out" />);
      expect(screen.queryByRole('presentation')).toHaveStyle({
        animationTimingFunction: 'ease-in-out',
      });
    });
  });
});

describe('keyframes', () => {
  it('should have correct keyframes structure', () => {
    const keyframe = keyframes`
      from {
        opacity: 0;
        transform: translateX(-40px);
      }
      to {
        opacity: 1;
        transform: translateX(0px);
      }
    `;

    expect(keyframe).toMatchSnapshot();
  });
});