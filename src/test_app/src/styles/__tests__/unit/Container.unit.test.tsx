/**
 * Модульные тесты для изолированной проверки компонента для Container
 * 
 * @file Container.unit.test.tsx
 * @description Тестирование Container 
 * @generated 2026-09-08T13:37:02.912Z
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
import { Container, AddTaskButton, StyledInput } from '../Container';

describe('Container', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<Container />);
      expect(screen.getByRole('button')).toHaveTextContent('Add Task');
      expect(screen.getByLabelText(/task name/i)).toBeInTheDocument();
    });

    it('should render with custom button text', () => {
      render(<Container buttonText="Custom Button" />);
      expect(screen.getByRole('button')).toHaveTextContent('Custom Button');
    });

    it('should render with disabled button', () => {
      render(<Container isDisabled={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render with different input placeholder', () => {
      render(<Container inputPlaceholder="Enter task here" />);
      expect(screen.getByLabelText(/task name/i)).toHaveAttribute('placeholder', 'Enter task here');
    });
  });

  describe('Обработка событий', () => {
    it('should call handleSubmit when form submitted', () => {
      const mockHandleSubmit = jest.fn();
      render(
        <Container handleSubmit={mockHandleSubmit}>
          <StyledInput />
          <AddTaskButton />
        </Container>
      );
      userEvent.type(screen.getByLabelText(/task name/i), 'Test Task');
      userEvent.click(screen.getByRole('button'));
      expect(mockHandleSubmit).toHaveBeenCalledWith('Test Task');
    });
  });

  describe('Вспомогательные функции', () => {
    it('getFontColor should return correct color based on theme', () => {
      const theme = { primary: '#ff0000' };
      expect(getFontColor('#ff0000')).toEqual('#ffffff');
    });
  });
});

// Mocking for child components if needed
// import { ThemeProvider } from '@emotion/react';
// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     primary: '#ff0000',
//     secondary: '#00ff00'
//   }
// });

// function TestApp() {
//   return (
//     <ThemeProvider theme={theme}>
//       <Container />
//     </ThemeProvider>
//   );
// }