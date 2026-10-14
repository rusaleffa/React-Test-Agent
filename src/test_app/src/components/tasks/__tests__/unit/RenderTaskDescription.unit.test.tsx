/**
 * Модульные тесты для изолированной проверки компонента для RenderTaskDescription
 * 
 * @file RenderTaskDescription.unit.test.tsx
 * @description Тестирование RenderTaskDescription 
 * @generated 2026-09-08T13:24:35.099Z
 * @type {unit}
 * @testCount 7
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
import { TaskContext } from '../../contexts/TaskContext';
import RenderTaskDescription from '../RenderTaskDescription';

const mockTask = {
  id: 'test-id',
  description: 'This is a test description with http://example.com and https://example.org',
  color: '#ff0000'
};

const mockToggleShowMore = jest.fn();
jest.mock('../../contexts/TaskContext', () => ({
  useContext: () => ({
    expandedTasks: ['test-id'],
    toggleShowMore
  })
}));

describe('RenderTaskDescription', () => {
  describe('Рендеринг', () => {
    it('should render without description', () => {
      render(<RenderTaskDescription task={mockTask} />);
      expect(screen.queryByText(/this is a test description/i)).toBeNull();
    });

    it('should render with short description', () => {
      mockTask.description = 'short desc';
      render(<RenderTaskDescription task={mockTask} />);
      expect(screen.getByText(/short desc/i)).toBeInTheDocument();
    });

    it('should render with long description', () => {
      mockTask.description = 'long description that exceeds limit';
      render(<RenderTaskDescription task={mockTask} />);
      expect(screen.getByText(/.../i)).toBeInTheDocument();
    });

    it('should render with more button', () => {
      render(<RenderTaskDescription task={mockTask} enableMoreButton={true} />);
      expect(screen.getByText(/show more/i)).toBeInTheDocument();
      userEvent.click(screen.getByText(/show more/i));
      expect(mockToggleShowMore).toHaveBeenCalledWith('test-id');
    });

    it('should not render more button when no description', () => {
      mockTask.description = '';
      render(<RenderTaskDescription task={mockTask} enableMoreButton={true} />);
      expect(screen.queryByText(/show more/i)).toBeNull();
    });

    it('should handle invalid URLs', () => {
      mockTask.description = 'invalid url: abcdefg';
      render(<RenderTaskDescription task={mockTask} />);
      expect(screen.getByText(/abcdefg/i)).toBeInTheDocument();
    });
  });

  describe('Взаимодействие с дочерними компонентами', () => {
    it('should pass correct props to DescriptionLink', () => {
      render(<RenderTaskDescription task={mockTask} />);
      const linkElement = screen.getByRole('link', { name: /example/i });
      expect(linkElement.getAttribute('href')).toEqual('http://example.com');
      expect(linkElement.getAttribute('rel')).toEqual('noreferrer');
      expect(linkElement.target).toEqual('_blank');
    });
  });
});