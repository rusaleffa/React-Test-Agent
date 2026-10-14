/**
 * Модульные тесты для изолированной проверки компонента для TabGroupProvider
 * 
 * @file TabGroupProvider.unit.test.tsx
 * @description Тестирование TabGroupProvider 
 * @generated 2026-09-07T22:48:00.415Z
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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TabGroupProvider } from '../TabGroupProvider';
import { TabPanel } from '../TabPanel';

describe('TabGroupProvider', () => {
  describe('Рендеринг', () => {
    it('should render with default props', () => {
      render(
        <TabGroupProvider>
          <TabPanel index={0}>Test content</TabPanel>
        </TabGroupProvider>
      );
      expect(screen.queryByText('Test content')).toBeInTheDocument();
    });

    it('should not render child when tab is not active', () => {
      render(
        <TabGroupProvider value={1}>
          <TabPanel index={0}>Test content</TabPanel>
        </TabGroupProvider>
      );
      expect(screen.queryByText('Test content')).not.toBeInTheDocument();
    });

    it('should render child when tab is active', () => {
      render(
        <TabGroupProvider value={0}>
          <TabPanel index={0}>Test content</TabPanel>
        </TabGroupProvider>
      );
      expect(screen.queryByText('Test content')).toBeInTheDocument();
    });

    it('should handle multiple tabs correctly', () => {
      render(
        <TabGroupProvider value={1}>
          <TabPanel index={0}>First tab content</TabPanel>
          <TabPanel index={1}>Second tab content</TabPanel>
        </TabGroupProvider>
      );
      expect(screen.queryByText('First tab content')).not.toBeInTheDocument();
      expect(screen.queryByText('Second tab content')).toBeInTheDocument();

      userEvent.click(screen.getByRole('tab', { name: /second tab/i }));
      expect(screen.queryByText('First tab content')).not.toBeInTheDocument();
      expect(screen.queryByText('Second tab content')).toBeInTheDocument();
    });
  });
});

describe('TabPanel', () => {
  describe('Rendering', () => {
    it('should render without errors', () => {
      render(
        <TabGroupProvider value={0}>
          <TabPanel index={0} />
        </TabGroupProvider>
      );
      expect(() => screen.queryByRole('tabpanel')).not.toThrow();
    });

    it('should hide panel when tab is inactive', () => {
      render(
        <TabGroupProvider value={1}>
          <TabPanel index={0} />
        </TabGroupProvider>
      );
      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    });

    it('should show panel when tab is active', () => {
      render(
        <TabGroupProvider value={0}>
          <TabPanel index={0} />
        </TabGroupProvider>
      );
      expect(screen.queryByRole('tabpanel')).toBeInTheDocument();
    });

    it('should have correct aria attributes', () => {
      render(
        <TabGroupProvider value={0}>
          <TabPanel index={0} />
        </TabGroupProvider>
      );
      const tabPanel = screen.getByRole('tabpanel');
      expect(tabPanel.getAttribute('id')).toMatch(/-tabpanel-\d+/);
      expect(tabPanel.getAttribute('aria-labelledby')).toMatch(/-tab-\d+/);
    });
  });
});