import { test, expect } from '@playwright/test';
import {
  fillDevExtremeInput,
  clickDevExtremeButton,
  waitForDevExtremeValidation,
  getDevExtremeValidationMessages,
} from '@playwright-devextreme/helpers';

/**
 * Example tests for DevExtreme Validation components
 */

test.describe('DevExtreme Validation Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sample application
    await page.goto('http://localhost:4200');
  });

  test('should validate a single input field', async ({ page }) => {
    // Use validation section specific selector
    const emailInputSelector = '#validation-section #email-input';

    // Fill form fields in validation section
    await fillDevExtremeInput(page, '#validation-section #name-input', 'John Doe');
    await fillDevExtremeInput(page, emailInputSelector, 'invalid-email');

    // Trigger validation (e.g., by clicking submit)
    await clickDevExtremeButton(page, '#submit-button');

    // Wait for validation
    const validation = await waitForDevExtremeValidation(
      page,
      emailInputSelector
    );
    expect(validation.isValid).toEqual(false);
    expect(validation.message).toBeTruthy();
  });

  test('should get all validation messages from validation group', async ({ page }) => {
    const formSelector = '#my-form';

    // Fill form with invalid data (use validation section selectors)
    await fillDevExtremeInput(page, '#validation-section #name-input', '');
    await fillDevExtremeInput(page, '#validation-section #email-input', 'invalid-email');

    // Trigger validation
    await clickDevExtremeButton(page, '#submit-button');

    // Get all validation messages from validation group
    const allMessages = await getDevExtremeValidationMessages(
      page,
      formSelector
    );
    expect(allMessages.length).toBeGreaterThan(0);
  });

  test('should check validation for valid input', async ({ page }) => {
    const emailInputSelector = '#validation-section #email-input';
    
    await fillDevExtremeInput(page, '#validation-section #name-input', 'John Doe');
    await fillDevExtremeInput(page, emailInputSelector, 'valid@email.com');
    await clickDevExtremeButton(page, '#submit-button');

    const validation = await waitForDevExtremeValidation(
      page,
      emailInputSelector
    );
    expect(validation.isValid).toEqual(true);
  });

  test('should get validation messages without selector', async ({ page }) => {
    // Get messages from default validation group
    await clickDevExtremeButton(page, '#submit-button');

    const messages = await getDevExtremeValidationMessages(page);
    // Assert based on your test requirements
    expect(Array.isArray(messages)).toEqual(true);
  });
});



