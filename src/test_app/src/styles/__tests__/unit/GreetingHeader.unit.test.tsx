/**
 * Модульные тесты для изолированной проверки компонента для GreetingHeader
 * 
 * @file GreetingHeader.unit.test.tsx
 * @description Тестирование GreetingHeader 
 * @generated 2026-09-08T13:38:26.296Z
 * @type {unit}
 * @testCount 11
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
import GreetingHeader from '../GreetingHeader';

describe('GreetingHeader', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<GreetingHeader />);
      expect(screen.getByRole('heading')).toHaveTextContent('Greeting Header');
    });

    it('should render with custom prop', () => {
      render(<GreetingHeader greeting="Custom Greeting" />);
      expect(screen.getByText(/Custom Greeting/)).toBeInTheDocument();
    });

    it('should handle media queries', () => {
      render(<GreetingHeader />);
      userEvent.resizeWindow(500, 500); // simulate small screen
      expect(screen.getByRole('heading')).toHaveStyle({
        fontSize: '22px',
      });
    });
  });
});

describe('TasksCountContainer', () => {
  it('should render tasks count container', () => {
    render(
      <GreetingHeader>
        <TasksCountContainer />
      </GreetingHeader>
    );
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});

describe('TaskCountTextContainer', () => {
  it('should render task count text container', () => {
    render(
      <GreetingHeader>
        <TaskCountTextContainer />
      </GreetingHeader>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

describe('TaskCountHeader', () => {
  it('should render task count header', () => {
    render(
      <GreetingHeader>
        <TaskCountHeader />
      </GreetingHeader>
    );
    expect(screen.getByRole('heading')).toHaveTextContent('');
  });
});

describe('TaskCompletionText', () => {
  it('should render task completion text', () => {
    render(
      <GreetingHeader>
        <TaskCompletionText />
      </GreetingHeader>
    );
    expect(screen.getByText('Task Completion Text')).toBeInTheDocument();
  });
});

describe('ProgressPercentageContainer', () => {
  it('should render progress percentage container', () => {
    render(
      <GreetingHeader>
        <ProgressPercentageContainer />
      </GreetingHeader>
    );
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });
});

describe('AddButton', () => {
  it('should render add button', () => {
    render(
      <GreetingHeader>
        <AddButton />
      </GreetingHeader>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should trigger click event', () => {
    render(
      <GreetingHeader>
        <AddButton />
      </GreetingHeader>
    );
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveFocus();
  });
});

describe('Offline', () => {
  it('should render offline component', () => {
    render(
      <GreetingHeader>
        <Offline />
      </GreetingHeader>
    );
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });
});