import { test, expect } from '@playwright/test';
import {
  waitForDevExtremeComponent,
  clickDevExtremeButton,
  isDevExtremeComponentInState,
} from '@playwright-devextreme/helpers';

/**
 * Example tests for DevExtreme Button component
 * 
 * NOTE: These are example tests that require actual DevExtreme Angular pages to run.
 * They are skipped by default. Uncomment page.goto() and update selectors to use with your application.
 */

test.describe('DevExtreme Button Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sample application
    await page.goto('http://localhost:4200');
  });

  test('should wait for button to be ready and click it', async ({ page }) => {
    const buttonSelector = '#my-button';

    // Wait for button to be ready
    await waitForDevExtremeComponent(page, buttonSelector);

    // Click the button
    await clickDevExtremeButton(page, buttonSelector);
  });

  test('should check if button is disabled', async ({ page }) => {
    const buttonSelector = '#my-button';

    // Wait for button to be ready
    await waitForDevExtremeComponent(page, buttonSelector);

    // Check if button is disabled
    const isDisabled = await isDevExtremeComponentInState(
      page,
      buttonSelector,
      'disabled'
    );
    expect(isDisabled).toEqual(false);
  });

  test('should wait for button to become enabled before clicking', async ({ page }) => {
    const buttonSelector = '#my-button';

    // Wait for button to be ready
    await waitForDevExtremeComponent(page, buttonSelector);

    // Check initial state
    const initiallyDisabled = await isDevExtremeComponentInState(
      page,
      buttonSelector,
      'disabled'
    );

    if (initiallyDisabled) {
      // Wait for button to become enabled using locator
      const button = page.locator(buttonSelector);
      await button.waitFor({ state: 'visible' });
      // Wait for disabled state to be removed
      await expect(button).not.toHaveAttribute('disabled', '');
      await expect(button).not.toHaveClass(/dx-state-disabled/);
    }

    // Now click the button
    await clickDevExtremeButton(page, buttonSelector);
  });

  test('should force click a button even if disabled', async ({ page }) => {
    const buttonSelector = '#my-button';

    await waitForDevExtremeComponent(page, buttonSelector);

    // Force click (bypasses enabled check)
    await clickDevExtremeButton(page, buttonSelector, { force: true });
  });
});


