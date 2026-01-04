import { test, expect } from '@playwright/test';
import {
  waitForDevExtremeComponent,
  findInShadowDOM,
  waitForDevExtremeAsyncOperation,
  clickDevExtremeButton,
} from '@nuanst-one/playwright-devextreme-angular';

/**
 * Example tests for DevExtreme core utilities
 * 
 * NOTE: These are example tests that require actual DevExtreme Angular pages to run.
 * They are skipped by default. Uncomment page.goto() and update selectors to use with your application.
 */

test.describe('DevExtreme Core Utilities', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sample application
    await page.goto('http://localhost:4200');
  });

  test('should wait for component to be ready', async ({ page }) => {
    const componentSelector = '#my-component';

    // Wait for component to be fully initialized
    const component = await waitForDevExtremeComponent(page, componentSelector);
    await expect(component).toBeVisible();
  });

  test('should wait for component with custom timeout', async ({ page }) => {
    const componentSelector = '#slow-component';

    const component = await waitForDevExtremeComponent(page, componentSelector, {
      timeout: 10000,
    });
    await expect(component).toBeVisible();
  });

  test('should wait for component in different states', async ({ page }) => {
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

  test('should handle Shadow DOM components', async ({ page }) => {
    // Note: DevExtreme components typically don't use Shadow DOM,
    // but this demonstrates how to use the helper if needed
    const hostSelector = '#shadow-host';
    const innerSelector = 'dx-button, button';

    // The helper functions handle Shadow DOM automatically
    // But you can also use findInShadowDOM directly if needed
    // Since DevExtreme doesn't use Shadow DOM, this will fall back to regular DOM
    const shadowButton = await findInShadowDOM(
      page,
      hostSelector,
      innerSelector
    );
    await shadowButton.click();
  });

  test('should wait for async operations to complete', async ({ page }) => {
    const componentSelector = '#async-component';

    // Wait for the component container to be visible
    await page.locator(componentSelector).waitFor({ state: 'visible' });
    
    // Wait for the button to be ready
    const button = page.locator('#async-component').locator('dx-button').first();
    await button.waitFor({ state: 'visible', timeout: 10000 });
    
    // Click button to trigger async data loading
    await button.click();

    // Wait for component to finish loading data (loadAsyncData has 2s setTimeout)
    await waitForDevExtremeAsyncOperation(page, componentSelector, {
      timeout: 30000,
      checkInterval: 500,
    });

    // Now component is ready for interaction
    const component = await waitForDevExtremeComponent(page, componentSelector, {
      timeout: 10000,
    });
    await expect(component).toBeVisible();
  });

  test('should wait for async operations with default settings', async ({ page }) => {
    const componentSelector = '#async-component';

    // Wait for component container to be visible
    await page.locator(componentSelector).waitFor({ state: 'visible' });
    
    // The async data loads automatically in constructor with 1s delay
    // Wait for the DataGrid inside to be ready (it will have data after 1s)
    const gridSelector = `${componentSelector} dx-data-grid`;
    await page.waitForSelector(gridSelector, { state: 'attached' });
    
    // Wait for the DataGrid to finish loading (it's the actual DevExtreme component)
    await waitForDevExtremeComponent(page, gridSelector, {
      timeout: 10000,
    });
    
    // Wait for async operation to complete (data loading)
    // Use the DataGrid selector instead of the container div
    await waitForDevExtremeAsyncOperation(page, gridSelector, {
      timeout: 10000, // Give enough time for the 1s setTimeout + rendering
    });

    // Component should be ready now
    const component = await waitForDevExtremeComponent(page, gridSelector, {
      timeout: 10000,
    });
    expect(component).toBeTruthy();
  });
});



