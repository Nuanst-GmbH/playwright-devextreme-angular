import { test, expect } from '@playwright/test';
import {
  waitForDevExtremeComponent,
  fillDevExtremeInput,
  getDevExtremeValue,
} from '@playwright-devextreme/helpers';

/**
 * Example tests for DevExtreme Input/Editor components
 * 
 * NOTE: These are example tests that require actual DevExtreme Angular pages to run.
 * They are skipped by default. Uncomment page.goto() and update selectors to use with your application.
 */

test.describe('DevExtreme Input Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to your application
    // await page.goto('http://localhost:4200');
  });

  test.skip('should fill a text input', async ({ page }) => {
    const inputSelector = '#my-textbox';

    // Wait for component to be ready
    await waitForDevExtremeComponent(page, inputSelector);

    // Fill the input
    await fillDevExtremeInput(page, inputSelector, 'Hello DevExtreme', {
      clear: true,
    });

    // Get the value and verify
    const value = await getDevExtremeValue(page, inputSelector);
    expect(value).toBe('Hello DevExtreme');
  });

  test.skip('should append to existing value', async ({ page }) => {
    const inputSelector = '#my-textbox';

    await waitForDevExtremeComponent(page, inputSelector);

    // Fill without clearing
    await fillDevExtremeInput(page, inputSelector, 'New Text', {
      clear: false,
    });
  });

  test.skip('should get value from input', async ({ page }) => {
    const inputSelector = '#my-textbox';

    await waitForDevExtremeComponent(page, inputSelector);

    // Get the current value
    const value = await getDevExtremeValue(page, inputSelector);
    expect(value).toBeTruthy();
  });

  test.skip('should handle textarea elements', async ({ page }) => {
    const textareaSelector = '#my-textarea';

    await waitForDevExtremeComponent(page, textareaSelector);

    const longText = 'This is a long text that should work in a textarea element.';
    await fillDevExtremeInput(page, textareaSelector, longText);

    const value = await getDevExtremeValue(page, textareaSelector);
    expect(value).toBe(longText);
  });
});


