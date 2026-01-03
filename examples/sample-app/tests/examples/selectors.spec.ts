import { test, expect } from '@playwright/test';
import { DevExtremeSelectors } from '@playwright-devextreme/helpers';

/**
 * Example tests for using DevExtreme predefined selectors
 */

test.describe('DevExtreme Selectors', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sample application
    await page.goto('http://localhost:4200');
  });

  test('should use predefined button selector', async ({ page }) => {
    // Use predefined selectors for common components
    const button = page.locator(DevExtremeSelectors.button).first();
    await button.waitFor({ state: 'visible' });
  });

  test('should find disabled buttons', async ({ page }) => {
    // Check for disabled state
    const disabledButton = page.locator(
      `${DevExtremeSelectors.button}${DevExtremeSelectors.disabled}`
    );
    const count = await disabledButton.count();
    // Assert based on your test requirements
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should use data grid selector', async ({ page }) => {
    const grid = page.locator(DevExtremeSelectors.dataGrid).first();
    await grid.waitFor({ state: 'visible' });
  });

  test('should combine selectors for complex queries', async ({ page }) => {
    // Find visible, enabled buttons
    const enabledButton = page.locator(
      `${DevExtremeSelectors.button}:not(${DevExtremeSelectors.disabled}):not(${DevExtremeSelectors.invisible})`
    );
    const count = await enabledButton.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should use validation selectors', async ({ page }) => {
    // Find validation group
    const validationGroup = page.locator(DevExtremeSelectors.validationGroup);
    
    // Find invalid messages
    const invalidMessages = page.locator(DevExtremeSelectors.invalidMessage);
    const messageCount = await invalidMessages.count();
    expect(messageCount).toBeGreaterThanOrEqual(0);
  });

  test('should use loading indicator selectors', async ({ page }) => {
    // Check for loading state
    const loadingIndicator = page.locator(DevExtremeSelectors.loadIndicator);
    const isVisible = await loadingIndicator.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });
});



