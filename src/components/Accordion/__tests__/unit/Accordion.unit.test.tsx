/**
 * Модульные тесты для изолированной проверки компонента для Accordion
 * 
 * @file Accordion.unit.test.tsx
 * @description Тестирование Accordion 
 * @generated 2026-09-07T22:12:34.504Z
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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Accordion from '../Accordion';
import { IGetRolesItem } from 'src/shared/store/api/users/users.types';

const mockData = [
  { name: 'role1', info: 'info1' },
  { name: 'role2', info: 'info2' },
];

const mockCheckedList = ['role1'];

describe('Accordion', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <Accordion
          title="Test Title"
          disabled={false}
          data={mockData}
          checkedList={mockCheckedList}
        />
      );

      expect(screen.getByText(/test title/i)).toBeInTheDocument();
      expect(screen.queryAllByRole('checkbox')).toHaveLength(2);
      expect(screen.getByText(/info1/i)).toBeInTheDocument();
      expect(screen.getByText(/info2/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });

    it('should render with disabled prop', () => {
      render(
        <Accordion
          title="Test Title"
          disabled={true}
          data={mockData}
          checkedList={[]}
        />
      );

      expect(screen.getByText(/test title/i)).toBeInTheDocument();
      expect(screen.queryAllByRole('checkbox')).toHaveLength(2);
      expect(screen.getByText(/info1/i)).toBeInTheDocument();
      expect(screen.getByText(/info2/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox').disabled).toEqual(true);
    });

    it('should render without data', () => {
      render(<Accordion title="Test Title" disabled={false} data={[]} checkedList={[]} />);

      expect(screen.getByText(/test title/i)).toBeInTheDocument();
      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });
  });

  describe('Обработка событий', () => {
    it('should handle click event', async () => {
      render(
        <Accordion
          title="Test Title"
          disabled={false}
          data={mockData}
          checkedList={[]}
        />
      );

      await userEvent.click(screen.getByRole('checkbox'));

      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });
  });

  describe('Проверки пропсов дочерних компонентов', () => {
    it('should pass correct props to children', () => {
      render(
        <Accordion
          title="Test Title"
          disabled={false}
          data={mockData}
          checkedList={['role1']}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.props.disabled).toEqual(false);
      expect(checkbox.props.checked).toEqual(true);
      expect(checkbox.props.sx).toMatchObject({
        '&.Mui-disabled': {
          color: '#0F74FF',
          opacity: 1,
        },
      });
    });
  });
});