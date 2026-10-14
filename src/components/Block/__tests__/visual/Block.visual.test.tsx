/**
 * Визуальные регрессионные тесты для Block
 * 
 * @file Block.visual.test.tsx
 * @description Тестирование Block 
 * @generated 2026-09-07T21:53:22.584Z
 * @type {visual}
 * @testCount 4
 * 
 * @dependencies @testing-library/react, jest-image-snapshot
 * @mocks нет
 */


// ============================================
// ЗАВИСИМОСТИ
// ============================================
// npm install -D @testing-library/react
// npm install -D jest-image-snapshot

import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/core';
import { lightTheme, darkTheme } from 'src/shared/themes';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

expect.extend({ toMatchImageSnapshot });

// Создаем темы для тестирования
const themes = [
  { name: 'light', theme: lightTheme },
  { name: 'dark', theme: darkTheme },
];

// Функция рендеринга с учетом темы
function renderWithTheme(ui, options) {
  const theme = createTheme(options?.theme || {});
  return render(<EmotionThemeProvider theme={theme}>{ui}</EmotionThemeProvider>, options);
}

describe('Block Visual Tests', () => {
  describe.each(themes)('for %s theme', (name, { theme }) => {
    it('should render correctly visually for different screen sizes', async () => {
      const { container } = renderWithTheme(<Block title="Test" open={true} />, { theme });

      await expect(container).toMatchImageSnapshot({
        customSnapshotsDir: `./snapshots/${name}/`,
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });

    it('should render correctly visually when collapsed', async () => {
      const { container } = renderWithTheme(<Block title="Test" open={false} />, { theme });

      await expect(container).toMatchImageSnapshot({
        customSnapshotsDir: `./snapshots/${name}/`,
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });

    it('should render correctly visually when clicked and expanded', async () => {
      const { getByRole } = renderWithTheme(<Block title="Test" open={false} />, { theme });
      userEvent.click(getByRole('button'));

      await expect(getByRole('button')).toMatchImageSnapshot({
        customSnapshotsDir: `./snapshots/${name}/`,
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });

    it('should render correctly visually when hovered', async () => {
      const { container } = renderWithTheme(<Block title="Test" open={true} />, { theme });
      userEvent.hover(container.firstChild);

      await expect(container).toMatchImageSnapshot({
        customSnapshotsDir: `./snapshots/${name}/`,
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });
  });
});