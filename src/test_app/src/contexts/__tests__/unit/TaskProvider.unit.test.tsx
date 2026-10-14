/**
 * Модульные тесты для изолированной проверки компонента для TaskProvider
 * 
 * @file TaskProvider.unit.test.tsx
 * @description Тестирование TaskProvider 
 * @generated 2026-09-08T13:29:50.714Z
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
import TaskProvider from '../TaskProvider';
import { TaskContext } from './TaskContext';

const MockChildComponent = () => <div data-testid="child-component" />;

describe('TaskProvider', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(<TaskProvider><MockChildComponent /></TaskProvider>);
      expect(screen.getByTestId('child-component')).toBeInTheDocument();
    });

    it('should pass correct context values to child components', () => {
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: ['test-task'],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: ['test-selected-task'],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      expect(mockContextValue.setSelectedTaskId).not.toHaveBeenCalled();
      expect(mockContextValue.setAnchorEl).not.toHaveBeenCalled();
      expect(mockContextValue.setAnchorPosition).not.toHaveBeenCalled();
      expect(mockContextValue.setExpandedTasks).not.toHaveBeenCalled();
      expect(mockContextValue.toggleShowMore).not.toHaveBeenCalled();
      expect(mockContextValue.setSearch).not.toHaveBeenCalled();
      expect(mockContextValue.highlightMatchingText).not.toHaveBeenCalled();
      expect(mockContextValue.setMultipleSelectedTasks).not.toHaveBeenCalled();
      expect(mockContextValue.handleSelectTask).not.toHaveBeenCalled();
      expect(mockContextValue.setEditModalOpen).not.toHaveBeenCalled();
      expect(mockContextValue.handleDeleteTask).not.toHaveBeenCalled();
      expect(mockContextValue.setDeleteDialogOpen).not.toHaveBeenCalled();
      expect(mockContextValue.handleCloseMoreMenu).not.toHaveBeenCalled();
      expect(mockContextValue.setSortOption).not.toHaveBeenCalled();
      expect(mockContextValue.setSortAnchorEl).not.toHaveBeenCalled();
      expect(mockContextValue.setMoveMode).not.toHaveBeenCalled();
      expect(mockContextValue.updateCategory).not.toHaveBeenCalled();
    });
  });

  describe('Обработка событий', () => {
    it('should call setSelectedTaskId when clicking on a task', () => {
      const mockSetSelectedTaskId = jest.fn();
      const mockContextValue = {
        selectedTaskId: null,
        setSelectedTaskId: mockSetSelectedTaskId,
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByTestId('child-component'));

      expect(mockSetSelectedTaskId).toHaveBeenCalledTimes(1);
    });

    it('should call setDeleteDialogOpen when clicking on delete button', async () => {
      const mockSetDeleteDialogOpen = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: mockSetDeleteDialogOpen,
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      await userEvent.click(screen.getByText(/delete/i));

      expect(mockSetDeleteDialogOpen).toHaveBeenCalledWith(true);
    });

    it('should call setEditModalOpen when clicking on edit button', () => {
      const mockSetEditModalOpen = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: mockSetEditModalOpen,
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByText(/edit/i));

      expect(mockSetEditModalOpen).toHaveBeenCalledWith(true);
    });

    it('should call setSortOption when clicking on sort menu', () => {
      const mockSetSortOption = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: mockSetSortOption,
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByText(/sort/i));

      expect(mockSetSortOption).toHaveBeenCalledTimes(1);
    });
  });

  describe('Управление состояниями', () => {
    it('should update selectedTaskId and anchorEl when selecting a task', () => {
      const mockSetSelectedTaskId = jest.fn();
      const mockSetAnchorEl = jest.fn();
      const mockContextValue = {
        selectedTaskId: null,
        setSelectedTaskId: mockSetSelectedTaskId,
        anchorEl: null,
        setAnchorEl: mockSetAnchorEl,
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByTestId('child-component'));

      expect(mockSetSelectedTaskId).toHaveBeenCalledWith('test-id');
      expect(mockSetAnchorEl).toHaveBeenCalledWith(null);
    });

    it('should toggle show more for a task', () => {
      const mockToggleShowMore = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: ['test-task'],
        setExpandedTasks: mockToggleShowMore,
        toggleShowMore: mockToggleShowMore,
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByText(/show more/i));

      expect(mockToggleShowMore).toHaveBeenCalledWith('test-task');
    });

    it('should open delete dialog when deleting a task', () => {
      const mockSetDeleteDialogOpen = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: mockSetDeleteDialogOpen,
        handleCloseMoreMenu: jest.fn(),
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(screen.getByText(/delete/i));

      expect(mockSetDeleteDialogOpen).toHaveBeenCalledWith(true);
    });

    it('should close more menu when clicking outside', () => {
      const mockHandleCloseMoreMenu = jest.fn();
      const mockContextValue = {
        selectedTaskId: 'test-id',
        setSelectedTaskId: jest.fn(),
        anchorEl: null,
        setAnchorEl: jest.fn(),
        anchorPosition: null,
        setAnchorPosition: jest.fn(),
        expandedTasks: [],
        setExpandedTasks: jest.fn(),
        toggleShowMore: jest.fn(),
        search: '',
        setSearch: jest.fn(),
        highlightMatchingText: jest.fn(),
        multipleSelectedTasks: [],
        setMultipleSelectedTasks: jest.fn(),
        handleSelectTask: jest.fn(),
        editModalOpen: false,
        setEditModalOpen: jest.fn(),
        handleDeleteTask: jest.fn(),
        deleteDialogOpen: false,
        setDeleteDialogOpen: jest.fn(),
        handleCloseMoreMenu: mockHandleCloseMoreMenu,
        sortOption: 'created_at',
        setSortOption: jest.fn(),
        sortAnchorEl: null,
        setSortAnchorEl: jest.fn(),
        moveMode: false,
        setMoveMode: jest.fn(),
        updateCategory: jest.fn(),
      };

      render(
        <TaskContext.Provider value={mockContextValue}>
          <MockChildComponent />
        </TaskContext.Provider>,
      );

      userEvent.click(document.body);

      expect(mockHandleCloseMoreMenu).toHaveBeenCalled();
    });
  });
});

describe('Highlighting matching text', () => {
  it('should highlight matching text correctly', () => {
    const mockContextValue = {
      selectedTaskId: null,
      setSelectedTaskId: jest.fn(),
      anchorEl: null,
      setAnchorEl: jest.fn(),
      anchorPosition: null,
      setAnchorPosition: jest.fn(),
      expandedTasks: [],
      setExpandedTasks: jest.fn(),
      toggleShowMore: jest.fn(),
      search: 'test',
      setSearch: jest.fn(),
      highlightMatchingText: jest.fn(),
      multipleSelectedTasks: [],
      setMultipleSelectedTasks: jest.fn(),
      handleSelectTask: jest.fn(),
      editModalOpen: false,
      setEditModalOpen: jest.fn(),
      handleDeleteTask: jest.fn(),
      deleteDialogOpen: false,
      setDeleteDialogOpen: jest.fn(),
      handleCloseMoreMenu: jest.fn(),
      sortOption: 'created_at',
      setSortOption: jest.fn(),
      sortAnchorEl: null,
      setSortAnchorEl: jest.fn(),
      moveMode: false,
      setMoveMode: jest.fn(),
      updateCategory: jest.fn(),
    };

    render(
      <TaskContext.Provider value={mockContextValue}>
        <MockChildComponent />
      </TaskContext.Provider>,
    );

    expect(mockContextValue.highlightMatchingText).toHaveBeenCalledWith('test-text');
  });
});