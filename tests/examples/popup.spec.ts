import { test, expect } from '@playwright/test';
import {
  clickDevExtremeButton,
  waitForDevExtremePopup,
  closeDevExtremePopup,
} from '@playwright-devextreme/helpers';

/**
 * Example tests for DevExtreme Popup/Modal components
 */

test.describe('DevExtreme Popup Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to your application
    // await page.goto('http://localhost:4200');
  });

  test.skip('should wait for popup to appear and interact with it', async ({ page }) => {
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

  test.skip('should wait for popup without title', async ({ page }) => {
    await clickDevExtremeButton(page, '#open-popup-button');

    // Wait for any popup to appear
    const popup = await waitForDevExtremePopup(page);
    expect(popup).toBeTruthy();

    await closeDevExtremePopup(page);
  });

  test.skip('should close popup using Escape key', async ({ page }) => {
    await clickDevExtremeButton(page, '#open-popup-button');
    await waitForDevExtremePopup(page);

    // Close using Escape key instead of close button
    await closeDevExtremePopup(page, { useCloseButton: false });
  });

  test.skip('should handle popup with custom timeout', async ({ page }) => {
    await clickDevExtremeButton(page, '#open-popup-button');

    // Wait with custom timeout
    const popup = await waitForDevExtremePopup(page, {
      timeout: 15000,
    });

    await closeDevExtremePopup(page, { timeout: 10000 });
  });
});


