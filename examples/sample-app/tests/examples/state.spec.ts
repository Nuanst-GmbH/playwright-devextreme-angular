import { test, expect } from '@playwright/test';
import {
  waitForDevExtremeComponent,
  isDevExtremeComponentInState,
} from '@playwright-devextreme/helpers';

/**
 * Example tests for DevExtreme component state checking
 */

test.describe('DevExtreme Component State Checking', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sample application
    await page.goto('http://localhost:4200');
  });

  test('should check if component is disabled', async ({ page }) => {
    const componentSelector = '#my-component';

    await waitForDevExtremeComponent(page, componentSelector);

    const isDisabled = await isDevExtremeComponentInState(
      page,
      componentSelector,
      'disabled'
    );
    expect(typeof isDisabled).toBe('boolean');
  });

  test('should check if component is readonly', async ({ page }) => {
    const componentSelector = '#my-component';

    await waitForDevExtremeComponent(page, componentSelector);

    const isReadonly = await isDevExtremeComponentInState(
      page,
      componentSelector,
      'readonly'
    );
    expect(typeof isReadonly).toBe('boolean');
  });

  test('should check if component is visible', async ({ page }) => {
    const componentSelector = '#my-component';

    await waitForDevExtremeComponent(page, componentSelector);

    const isVisible = await isDevExtremeComponentInState(
      page,
      componentSelector,
      'visible'
    );
    expect(isVisible).toBe(true);
  });

  test('should check if component is hidden', async ({ page }) => {
    const componentSelector = '#my-component';

    await waitForDevExtremeComponent(page, componentSelector);

    const isHidden = await isDevExtremeComponentInState(
      page,
      componentSelector,
      'hidden'
    );
    expect(typeof isHidden).toBe('boolean');
  });

  test('should check multiple states', async ({ page }) => {
    const componentSelector = '#my-component';

    await waitForDevExtremeComponent(page, componentSelector);

    // Check various states
    const isDisabled = await isDevExtremeComponentInState(
      page,
      componentSelector,
      'disabled'
    );
    const isReadonly = await isDevExtremeComponentInState(
      page,
      componentSelector,
      'readonly'
    );
    const isVisible = await isDevExtremeComponentInState(
      page,
      componentSelector,
      'visible'
    );

    expect(isVisible).toBe(true);
    // Add your assertions based on expected state
  });
});



