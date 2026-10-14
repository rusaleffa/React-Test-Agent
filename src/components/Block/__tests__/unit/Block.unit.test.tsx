/**
 * Модульные тесты для изолированной проверки компонента для Block
 * 
 * @file Block.unit.test.tsx
 * @description Тестирование Block 
 * @generated 2026-09-07T22:13:13.813Z
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
import Block from '../Block';

describe('Block', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<Block title="Test" />);
      expect(screen.getByText(/test/i)).toBeInTheDocument();
    });

    it('should render with custom children', () => {
      const child = <div data-testid="child">Child</div>;
      render(<Block title="Test">{child}</Block>);
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render with hide prop', () => {
      render(<Block title="Test" withHide={true} />);
      expect(screen.queryByRole('button')).not.toBeNull();
    });

    it('should not render hide button if withHide is false', () => {
      render(<Block title="Test" withHide={false} />);
      expect(screen.queryByRole('button')).toBeNull();
    });

    it('should render collapse when open prop is true', () => {
      render(<Block title="Test" open={true}>Content</Block>);
      expect(screen.getByText(/content/i)).toBeInTheDocument();
    });

    it('should not render collapse when open prop is false', () => {
      render(<Block title="Test" open={false}>Content</Block>);
      expect(screen.queryByText(/content/i)).toBeNull();
    });
  });

  describe('Обработка событий', () => {
    let mockOnToggle;
    beforeEach(() => {
      mockOnToggle = jest.fn();
    });

    it('should call onToggle when click on title', async () => {
      render(<Block title="Test" onToggle={mockOnToggle} open={false} />);
      await userEvent.click(screen.getByText(/test/i));
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should change state of block and collapse', async () => {
      render(<Block title="Test" onToggle={mockOnToggle} open={false} >Content</Block>);
      await userEvent.click(screen.getByText(/test/i));
      expect(screen.getByText(/content/i)).toBeInTheDocument();
    });
  });

  describe('Вспомогательные функции', () => {
    it('should have correct icon rotation', () => {
      render(<Block title="Test" open={true} onToggle={() => {}} withHide={true} />);
      const icon = screen.getByRole('button');
      expect(icon.firstChild.style.transform).toEqual('rotate(0deg)');

      render(<Block title="Test" open={false} onToggle={() => {}} withHide={true} />);
      expect(icon.firstChild.style.transform).toEqual('rotate(180deg)');
    });
  });
});