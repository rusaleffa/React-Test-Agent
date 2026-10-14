/**
 * Модульные тесты для изолированной проверки компонента для CategorySelect
 * 
 * @file CategorySelect.unit.test.tsx
 * @description Тестирование CategorySelect 
 * @generated 2026-09-07T22:44:01.656Z
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
import { MemoryRouter } from 'react-router-dom';
import CategorySelect from './CategorySelect';
import { UserContext } from '../../contexts/UserContext';
import { ColorPalette } from '../../theme/themeConfig';
import { useSystemTheme } from '../../hooks/useSystemTheme';
import { useToasterStore } from 'react-hot-toast';

jest.mock('../../hooks/useSystemTheme');
jest.mock('react-hot-toast');

const mockUser = {
  categories: [],
  emojisStyle: {},
  favoriteCategories: []
};

const mockUseSystemTheme = jest.fn().mockReturnValue({
  darkmode: false,
  palette: {
    secondary: {
      main: '#ff0000'
    }
  }
});

const mockUseToasterStore = jest.fn();

describe('CategorySelect', () => {
  beforeEach(() => {
    useSystemTheme.mockImplementation(mockUseSystemTheme);
    useToasterStore.mockImplementation(mockUseToasterStore);
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser }}>
            <CategorySelect />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.getByText(/Category/i)).toBeInTheDocument();
    });

    it('renders with provided width prop', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser }}>
            <CategorySelect width="50%" />
          </UserContext.Provider>
        </MemoryRouter>
      );
      const select = screen.getByRole('combobox');
      expect(select.style.width).toEqual('50%');
    });

    it('renders with custom fontColor prop', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: mockUser }}>
            <CategorySelect fontColor="#00ff00" />
          </UserContext.Provider>
        </MemoryRouter>
      );
      const formLabel = screen.getByText(/Category/i);
      expect(formLabel.style.color).toEqual('#00ff00e8');
    });

    it('displays empty message when no categories are available', () => {
      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: [] } }}>
            <CategorySelect />
          </UserContext.Provider>
        </MemoryRouter>
      );
      expect(screen.getByText(/You don't have any categories/i)).toBeInTheDocument();
    });

    it('selects and deselects categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Test Category 1', color: '#00ff00' },
        { id: '2', name: 'Test Category 2', color: '#ff0000' }
      ];

      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: mockCategories } }}>
            <CategorySelect />
          </UserContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        userEvent.click(select);
      });

      const menuItem1 = screen.getByText(/Test Category 1/i);
      const menuItem2 = screen.getByText(/Test Category 2/i);

      userEvent.click(menuItem1);
      userEvent.click(menuItem2);

      expect(screen.queryAllByText(/Test Category 1/i)).toHaveLength(1);
      expect(screen.queryAllByText(/Test Category 2/i)).toHaveLength(1);
    });
  });

  describe('Events', () => {
    it('handles category change correctly', async () => {
      const mockOnCategoryChange = jest.fn();
      const mockCategories = [
        { id: '1', name: 'Test Category 1', color: '#00ff00' },
        { id: '2', name: 'Test Category 2', color: '#ff0000' }
      ];

      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: mockCategories } }}>
            <CategorySelect onCategoryChange={mockOnCategoryChange} />
          </UserContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        userEvent.click(select);
      });

      const menuItem1 = screen.getByText(/Test Category 1/i);
      const menuItem2 = screen.getByText(/Test Category 2/i);

      userEvent.click(menuItem1);
      userEvent.click(menuItem2);

      expect(mockOnCategoryChange).toHaveBeenCalledWith([mockCategories[0], mockCategories[1]]);
    });

    it('prevents adding more than allowed categories', async () {
      const mockOnCategoryChange = jest.fn();
      const mockCategories = [
        { id: '1', name: 'Test Category 1', color: '#00ff00' },
        { id: '2', name: 'Test Category 2', color: '#ff0000' }
      ];

      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: mockCategories } }}>
            <CategorySelect onCategoryChange={mockOnCategoryChange} />
          </UserContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        userEvent.click(select);
      });

      const menuItem1 = screen.getByText(/Test Category 1/i);
      const menuItem2 = screen.getByText(/Test Category 2/i);

      userEvent.click(menuItem1);
      userEvent.click(menuItem2);

      // Attempt to add a third category which should fail
      const menuItem3 = screen.getByText(/Test Category 3/i);
      userEvent.click(menuItem3);

      expect(mockOnCategoryChange).not.toHaveBeenCalledWith([...mockCategories, { id: '3' }]);
    });
  });

  describe('Interaction with children components', () => {
    it('passes correct props to child components', () => {
      const mockCategories = [
        { id: '1', name: 'Test Category 1', color: '#00ff00' },
        { id: '2', name: 'Test Category 2', color: '#ff0000' }
      ];

      render(
        <MemoryRouter>
          <UserContext.Provider value={{ user: { ...mockUser, categories: mockCategories } }}>
            <CategorySelect />
          </UserContext.Provider>
        </MemoryRouter>
      );

      const select = screen.getByRole('combobox');
      userEvent.click(select);

      const menuItem1 = screen.getByText(/Test Category 1/i);
      const menuItem2 = screen.getByText(/Test Category 2/i);

      expect(menuItem1.props['tabIndex']).toEqual(0);
      expect(menuItem2.props['tabIndex']).toEqual(0);
    });
  });
});