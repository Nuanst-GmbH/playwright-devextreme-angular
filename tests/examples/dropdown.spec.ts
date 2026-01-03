import { test, expect } from '@playwright/test';
import {
  waitForDevExtremeComponent,
  selectDevExtremeDropdown,
  getDevExtremeValue,
} from '@playwright-devextreme/helpers';

/**
 * Example tests for DevExtreme Dropdown/SelectBox components
 */

test.describe('DevExtreme Dropdown Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to your application
    // await page.goto('http://localhost:4200');
  });

  test.skip('should select value by text', async ({ page }) => {
    const dropdownSelector = '#my-dropdown';

    // Wait for dropdown to be ready
    await waitForDevExtremeComponent(page, dropdownSelector);

    // Select by text
    await selectDevExtremeDropdown(page, dropdownSelector, 'Option 1', {
      byText: true,
    });

    // Verify selection
    const value = await getDevExtremeValue(page, dropdownSelector);
    expect(value).toContain('Option 1');
  });

  test.skip('should select value by data-value attribute', async ({ page }) => {
    const dropdownSelector = '#my-dropdown';

    await waitForDevExtremeComponent(page, dropdownSelector);

    // Select by value (not text)
    await selectDevExtremeDropdown(page, dropdownSelector, 'value-123', {
      byText: false,
    });

    const value = await getDevExtremeValue(page, dropdownSelector);
    expect(value).toBeTruthy();
  });

  test.skip('should handle numeric values', async ({ page }) => {
    const dropdownSelector = '#my-dropdown';

    await waitForDevExtremeComponent(page, dropdownSelector);

    // Select by numeric value
    await selectDevExtremeDropdown(page, dropdownSelector, 42, {
      byText: false,
    });
  });
});


