/**
 * Модульные тесты для изолированной проверки компонента для handleKeyDown
 * 
 * @file handleKeyDown.unit.test.tsx
 * @description Тестирование handleKeyDown 
 * @generated 2026-09-08T13:19:53.963Z
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
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CustomRadioGroup from './CustomRadioGroup';  

describe('CustomRadioGroup component', () => {
  let props;

  beforeEach(() => {
    props = {
      options: [
        { value: 'option1', label: 'Option 1', icon: <span data-testid='icon1' />, },
        { value: 'option2', label: 'Option 2', icon: <span data-testid='icon2' />, },
        { value: 'option3', label: 'Option 3', icon: <span data-testid='icon3' />, },
      ],
      value: 'option1',
      onChange: jest.fn(),
    };
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<CustomRadioGroup {...props} />);

      expect(screen.getByRole('radio-group')).toBeInTheDocument();
      expect(screen.queryAllByRole('radio').length).toEqual(props.options.length);
      expect(screen.getByTestId('icon1')).toBeInTheDocument();
      expect(screen.getByTestId('icon2')).toBeInTheDocument();
      expect(screen.getByTestId('icon3')).toBeInTheDocument();
    });

    it('handles disabled options', () => {
      props.disabledOptions = ['option2'];
      render(<CustomRadioGroup {...props} />);

      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.queryByRole('radio', { name: 'Option 2' })).not.toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Option 3' })).toBeInTheDocument();
    });

    it('updates state when a radio button is clicked', async () => {
      render(<CustomRadioGroup {...props} />);

      await userEvent.click(screen.getByRole('radio', { name: 'Option 2' }));

      expect(props.onChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates between radio buttons using arrow keys', async () => {
      render(<CustomRadioGroup {...props} />);

      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');

      expect(screen.getByRole('radio', { name: 'Option 2' })).toHaveFocus();
    });

    it('highlights the currently focused option', async () => {
      render(<CustomRadioGroup {...props} />);

      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');

      expect(screen.getByRole('radio', { name: 'Option 2' }).closest('.MuiFormControlLabel-root')).toHaveStyleRule('border', '1px solid');
    });
  });

  describe('Focus Hint', () => {
    it('displays focus hint when focused and keyboard focus is active', () => {
      render(<CustomRadioGroup {...props} />);

      userEvent.tab();
      userEvent.keyboard('{ArrowRight}');

      expect(screen.getByText(/Navigate with arrow keys/i)).toBeInTheDocument();
    });
  });
});