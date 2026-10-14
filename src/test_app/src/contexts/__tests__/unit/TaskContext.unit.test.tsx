/**
 * Модульные тесты для изолированной проверки компонента для TaskContext
 * 
 * @file TaskContext.unit.test.tsx
 * @description Тестирование TaskContext 
 * @generated 2026-09-08T13:29:08.613Z
 * @type {unit}
 * @testCount 2
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
import TaskContext from '../TaskContext';

describe('TaskContext', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TaskContext />);
      expect(screen.queryByRole('context')).toBeInTheDocument();
    });

    it('should render with custom states and actions', () => {
      const taskState = {
        selectedTaskId: 'test-id',
        anchorEl: null,
        anchorPosition: null,
        expandedTasks: ['id1', 'id2'],
        multipleSelectedTasks: ['id3', 'id4'],
        search: 'search-text',
        editModalOpen: true,
        deleteDialogOpen: false,
        sortOption: 'sort-by-date',
        sortAnchorEl: null,
        moveMode: true
      };
      const taskActions = {
        setSelectedTaskId: jest.fn(),
        setAnchorEl: jest.fn(),
        setAnchorPosition: jest.fn(),
        setExpandedTasks: jest.fn(),
        setMultipleSelectedTasks: jest.fn(),
        setSearch: jest.fn(),
        toggleShowMore: jest.fn(),
        handleSelectTask: jest.fn(),
        highlightMatchingText: jest.fn(),
        setEditModalOpen: jest.fn(),
        setDeleteDialogOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        setSortOption: jest.fn(),
        setSortAnchorEl: jest.fn(),
        setMoveMode: jest.fn(),
        updateCategory: jest.fn()
      };
      render(
        <TaskContext.Provider value={{...taskState, ...taskActions}}>
          <div>Test Content</div>
        </TaskContext.Provider>
      );
      expect(screen.queryByText('Test Content')).toBeInTheDocument();
    });
  });
});