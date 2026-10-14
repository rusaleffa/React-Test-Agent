/**
 * Модульные тесты для изолированной проверки компонента для TaskContainer
 * 
 * @file TaskContainer.unit.test.tsx
 * @description Тестирование TaskContainer 
 * @generated 2026-09-08T13:28:05.944Z
 * @type {unit}
 * @testCount 8
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
import TaskContainer from './tasks.styled.tsx';  

describe('TaskContainer', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TaskContainer />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        backgroundColor: '#ffffff',
        opacity: '1',
        borderLeft: '1px solid transparent'
      });
    });

    it('should render with custom background color', () => {
      render(<TaskContainer backgroundColor="#ff0000" done={false} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        backgroundColor: '#ff0000',
        opacity: '1',
        borderLeft: '1px solid transparent'
      });
    });

    it('should render with done state', () => {
      render(<TaskContainer backgroundColor="#ff0000" done={true} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        backgroundColor: '#ff0000cc',
        opacity: '0.8',
        borderLeft: '8px solid #00ff1ee3'
      });
    });

    it('should render with glow effect', () => {
      render(<TaskContainer backgroundColor="#ff0000" glow={true} blur={false} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        boxShadow: '0 0 128px -20px #ff0000'
      });
    });

    it('should render with blur effect', () => {
      render(<TaskContainer backgroundColor="#ff0000" blur={true} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        filter: 'blur(2px) opacity(75%)'
      });
    });

    it('should render with dark theme', () => {
      render(<TaskContainer backgroundColor="#000000" done={false} theme={{ primary: '#000000' }} />, {
        initialWindowSize: { width: 1024, height: 768 },
      });
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('task-container')).toHaveStyle({
        backgroundColor: '#000000',
        color: '#ffffff'
      });
    });
  });

  describe('Обработка событий', () => {
    it('should handle click event', async () => {
      render(<TaskContainer backgroundColor="#ff0000" done={false} />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });
  });

  describe('Взаимодействие с дочерними элементами', () => {
    it('should pass correct props to child components', () => {
      render(
        <TaskContainer>
          <TaskInfo />
        </TaskContainer>
      );
      expect(screen.getByRole('heading', { name: 'Task Name' }).parentElement).toHaveAttribute('data-testid', 'task-info');
    });
  });
});