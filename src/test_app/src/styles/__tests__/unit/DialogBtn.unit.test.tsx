/**
 * Модульные тесты для изолированной проверки компонента для DialogBtn
 * 
 * @file DialogBtn.unit.test.tsx
 * @description Тестирование DialogBtn 
 * @generated 2026-09-08T13:37:44.516Z
 * @type {unit}
 * @testCount 12
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
import DialogBtn from '../DialogBtn';

describe('DialogBtn', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<DialogBtn />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      render(<DialogBtn children="Custom Text" />);
      expect(screen.getByText(/custom text/i)).toBeInTheDocument();
    });

    it('should render with custom styles', () => {
      render(
        <DialogBtn style={{ backgroundColor: 'red' }}>
          Custom Style
        </DialogBtn>
      );
      expect(screen.getByRole('button').style.backgroundColor).toEqual('red');
    });
  });

  describe('Обработка событий', () => {
    it('should call onClick handler when clicked', () => {
      const mockOnClick = jest.fn();
      render(<DialogBtn onClick={mockOnClick}>Button</DialogBtn>);
      userEvent.click(screen.getByRole('button'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Вспомогательные стили и компоненты', () => {
    it('should apply correct styles to child components', () => {
      render(
        <DialogBtn>
          <PathName>Test Path</PathName>
        </DialogBtn>
      );
      expect(screen.getByRole('link')).toHaveStyleRule('background', '#000000c8');
      expect(screen.getByRole('link')).toHaveStyleRule('color', 'white');
    });

    it('should have correct styling for pulse label', () => {
      render(
        <DialogBtn>
          <PulseLabel />
        </DialogBtn>
      );
      expect(screen.getByRole('presentation')).toHaveStyleRule(
        'animation',
        'pulseAnimation(theme.primary, 8) 1.2s infinite'
      );
    });

    it('should handle visually hidden input correctly', () => {
      render(
        <DialogBtn>
          <VisuallyHiddenInput type="text" name="test" />
        </DialogBtn>
      );
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });
});

describe('UserAvatar', () => {
  it('should render avatar with image and no pulse', () => {
    render(
      <UserAvatar hasimage size="40px">
        <img alt="avatar" src="/path/to/image.jpg" />
      </UserAvatar>
    );
    expect(screen.getByAltText('avatar')).toBeInTheDocument();
  });

  it('should render avatar without image and with pulse', () => {
    render(
      <UserAvatar hasimage={false} size="40px" pulse>
        <div>No Image</div>
      </UserAvatar>
    );
    expect(screen.getByText('No Image')).toBeInTheDocument();
    expect(screen.getByRole('presentation')).toHaveStyleRule(
      'animation',
      'pulseAnimation(theme.darkmode ? "#5e5e65" : "#8c919c", 10) 1.2s infinite'
    );
  });
});

describe('ColorElement', () => {
  it('should render button with default colors', () => {
    render(
      <ColorElement>
        <span>Default Color</span>
      </ColorElement>
    );
    expect(screen.getByText('Default Color')).toHaveStyleRule(
      'background',
      'transparent'
    );
  });

  it('should render button with gradient colors', () => {
    render(
      <ColorElement clr="#ff0000" secondClr="#00ff00">
        <span>Gradient Colors</span>
      </ColorElement>
    );
    expect(screen.getByText('Gradient Colors')).toHaveStyleRule(
      'background',
      'linear-gradient(135deg, #ff0000 50%, #00ff00 50%)'
    );
  });

  it('should render button with hover effect', () => {
    const mockDisableHover = false;
    render(
      <ColorElement disableHover={mockDisableHover}>
        <span>Hover Effect</span>
      </ColorElement>
    );
    userEvent.hover(screen.getByText('Hover Effect'));
    expect(screen.getByText('Hover Effect')).toHaveStyleRule(
      'box-shadow',
      '0 0 12px #ff0000'
    );
  });
});