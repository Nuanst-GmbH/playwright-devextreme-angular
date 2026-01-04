import { test, expect } from '@playwright/test';
import {
  waitForDevExtremeComponent,
  fillDevExtremeInput,
  getDevExtremeValue,
} from '@nuanst-one/playwright-devextreme-angular';

/**
 * Example tests for DevExtreme Input/Editor components
 * 
 * NOTE: These are example tests that require actual DevExtreme Angular pages to run.
 * They are skipped by default. Uncomment page.goto() and update selectors to use with your application.
 */

test.describe('DevExtreme Input Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sample application
    await page.goto('http://localhost:4200');
  });

  test('should fill a text input', async ({ page }) => {
    const inputSelector = '#my-textbox';

    // Wait for component to be ready
    await waitForDevExtremeComponent(page, inputSelector);

    // Fill the input
    await fillDevExtremeInput(page, inputSelector, 'Hello DevExtreme', {
      clear: true,
    });

    // Get the value and verify
    const value = await getDevExtremeValue(page, inputSelector);
    expect(value).toEqual('Hello DevExtreme');
  });

  test('should append to existing value', async ({ page }) => {
    const inputSelector = '#my-textbox';

    await waitForDevExtremeComponent(page, inputSelector);

    // Fill without clearing
    await fillDevExtremeInput(page, inputSelector, 'New Text', {
      clear: false,
    });
  });

  test('should get value from input', async ({ page }) => {
    const inputSelector = '#my-textbox';

    await waitForDevExtremeComponent(page, inputSelector);

    // Fill with a value first
    await fillDevExtremeInput(page, inputSelector, 'Test Value', { clear: true });

    // Get the current value
    const value = await getDevExtremeValue(page, inputSelector);
    expect(value).toEqual('Test Value');
  });

  test('should handle textarea elements', async ({ page }) => {
    const textareaSelector = '#my-textarea';

    // Wait for textarea to be visible (regular HTML textarea, not DevExtreme)
    await page.locator(textareaSelector).waitFor({ state: 'visible' });

    const longText = 'This is a long text that should work in a textarea element.';
    await page.locator(textareaSelector).fill(longText);

    const value = await page.locator(textareaSelector).inputValue();
    expect(value).toEqual(longText);
  });
});



