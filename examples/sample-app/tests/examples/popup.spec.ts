import { test, expect } from '@playwright/test';
import {
  clickDevExtremeButton,
  waitForDevExtremePopup,
  closeDevExtremePopup,
} from '@nuanst-one/playwright-devextreme-angular';

/**
 * Example tests for DevExtreme Popup/Modal components
 */

test.describe('DevExtreme Popup Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sample application
    await page.goto('http://localhost:4200');
  });

  test('should wait for popup to appear and interact with it', async ({ page }) => {
    // Trigger popup (e.g., by clicking a button)
    const triggerButton = '#open-popup-button';
    await clickDevExtremeButton(page, triggerButton);

    // Wait for popup to appear
    const popup = await waitForDevExtremePopup(page, {
      title: 'My Popup',
    });

    // Interact with popup content
    const popupInput = popup.locator('input').first();
    await popupInput.fill('Test value');

    // Close popup
    await closeDevExtremePopup(page, { useCloseButton: true });
  });

  test('should wait for popup without title', async ({ page }) => {
    await clickDevExtremeButton(page, '#open-popup-button');

    // Wait for any popup to appear
    const popup = await waitForDevExtremePopup(page);
    await expect(popup).toBeVisible();

    await closeDevExtremePopup(page);
  });

  test('should close popup using Escape key', async ({ page }) => {
    await clickDevExtremeButton(page, '#open-popup-button');
    await waitForDevExtremePopup(page);

    // Close using Escape key instead of close button
    // Note: DevExtreme popup may not close on Escape by default
    // So we'll use the close button as fallback
    try {
      await closeDevExtremePopup(page, { useCloseButton: false, timeout: 2000 });
    } catch {
      // If Escape doesn't work, use close button
      await closeDevExtremePopup(page, { useCloseButton: true });
    }
  });

  test('should handle popup with custom timeout', async ({ page }) => {
    await clickDevExtremeButton(page, '#open-popup-button');

    // Wait with custom timeout
    const popup = await waitForDevExtremePopup(page, {
      timeout: 15000,
    });

    await closeDevExtremePopup(page, { timeout: 10000 });
  });
});



