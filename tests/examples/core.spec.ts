import { test, expect } from '@playwright/test';
import {
  waitForDevExtremeComponent,
  findInShadowDOM,
  waitForDevExtremeAsyncOperation,
  clickDevExtremeButton,
} from '@playwright-devextreme/helpers';

/**
 * Example tests for DevExtreme core utilities
 * 
 * NOTE: These are example tests that require actual DevExtreme Angular pages to run.
 * They are skipped by default. Uncomment page.goto() and update selectors to use with your application.
 */

test.describe('DevExtreme Core Utilities', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to your application
    // await page.goto('http://localhost:4200');
  });

  test.skip('should wait for component to be ready', async ({ page }) => {
    const componentSelector = '#my-component';

    // Wait for component to be fully initialized
    const component = await waitForDevExtremeComponent(page, componentSelector);
    expect(component).toBeTruthy();
  });

  test.skip('should wait for component with custom timeout', async ({ page }) => {
    const componentSelector = '#slow-component';

    const component = await waitForDevExtremeComponent(page, componentSelector, {
      timeout: 10000,
    });
    expect(component).toBeTruthy();
  });

  test.skip('should wait for component in different states', async ({ page }) => {
    const componentSelector = '#my-component';

    // Wait for component to be attached (but not necessarily visible)
    await waitForDevExtremeComponent(page, componentSelector, {
      state: 'attached',
    });

    // Wait for component to be visible
    await waitForDevExtremeComponent(page, componentSelector, {
      state: 'visible',
    });
  });

  test.skip('should handle Shadow DOM components', async ({ page }) => {
    // Some DevExtreme components may use Shadow DOM
    const hostSelector = '#shadow-host';
    const innerSelector = 'button';

    // The helper functions handle Shadow DOM automatically
    // But you can also use findInShadowDOM directly if needed
    const shadowButton = await findInShadowDOM(
      page,
      hostSelector,
      innerSelector
    );
    await shadowButton.click();
  });

  test.skip('should wait for async operations to complete', async ({ page }) => {
    const componentSelector = '#async-component';

    // Wait for component to finish loading data
    await waitForDevExtremeAsyncOperation(page, componentSelector, {
      timeout: 30000,
      checkInterval: 500,
    });

    // Now component is ready for interaction
    await clickDevExtremeButton(page, componentSelector + ' button');
  });

  test.skip('should wait for async operations with default settings', async ({ page }) => {
    const componentSelector = '#async-component';

    await waitForDevExtremeAsyncOperation(page, componentSelector);

    // Component should be ready now
    const component = await waitForDevExtremeComponent(page, componentSelector);
    expect(component).toBeTruthy();
  });
});


