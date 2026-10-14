/**
 * Модульные тесты для изолированной проверки компонента для ColorPicker
 * 
 * @file ColorPicker.unit.test.tsx
 * @description Тестирование ColorPicker 
 * @generated 2026-09-07T22:44:28.506Z
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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ColorPicker from '../ColorPicker';

describe('ColorPicker', () => {
  let mockSetUser;
  let mockShowToast;

  beforeEach(() => {
    mockSetUser = jest.fn();
    mockShowToast = jest.fn();
    global.showToast = mockShowToast;
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      expect(screen.getByText(/test label/i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveStyle({ border: '1px solid rgba(0, 0, 0, 0.23)' });
      expect(screen.getAllByRole('tooltip').length).toEqual(9); // assuming 9 colors in the list
    });

    it('should render with custom width', () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={300} fontColor="#fff" label="Test Label" />);

      expect(screen.getByRole('button')).toHaveStyle({ width: '300px' });
    });

    it('should render with no label', () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" />);

      expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    });

    it('should render with invalid hex color', () => {
      render(<ColorPicker color="invalid_color" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      expect(mockSetUser).toHaveBeenCalledWith({ ...mockSetUser.mock.calls[0][0], colorList: [] });
      expect(mockShowToast).toHaveBeenCalledWith('Invalid hex color invalid_color');
    });
  });

  describe('Interaction', () => {
    it('should change color on click', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.click(screen.getByRole('button'));

      expect(mockShowToast).toHaveBeenCalledWith('Added FF0000 to your color list.');
    });

    it('should open dialog on add button click', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.click(screen.getByRole('button', { name: /add new color/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close dialog on cancel button click', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.click(screen.getByRole('button', { name: /add new color/i }));
      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should add color to list', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.click(screen.getByRole('button', { name: /add new color/i }));
      await userEvent.type(screen.getByRole('textbox'), 'new_color');
      await userEvent.click(screen.getByRole('button', { name: /set/i }));

      expect(mockShowToast).toHaveBeenCalledWith('Added new_color to your color list.', {
        iconTheme: { primary: 'new_color', secondary: getFontColor('new_color') },
        style: { borderColor: 'new_color' },
      });
    });

    it('should delete color from list', async () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      await userEvent.contextMenu(screen.getByRole('button'));
      await userEvent.click(screen.getByRole('menuitem', { name: /delete/i }));

      expect(mockShowToast).toHaveBeenCalledWith('Removed FF0000 from your color list.');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

      expect(screen.getAllByRole('button')[0]).toHaveAccessibleName('Select color - FF0000');
    });
  });
});

describe('Helper Functions', () => {
  it('should call showToast correctly', () => {
    render(<ColorPicker color="#FF0000" onColorChange={() => {}} width={200} fontColor="#fff" label="Test Label" />);

    userEvent.click(screen.getByRole('button'));

    expect(mockShowToast).toHaveBeenCalledWith('Added FF0000 to your color list.');
  });
});