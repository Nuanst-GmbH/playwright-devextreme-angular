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
    const formSelector = '#my-form';

    // Fill form fields
    await fillDevExtremeInput(page, '#name-input', 'John Doe');
    await fillDevExtremeInput(page, '#email-input', 'invalid-email');

    // Trigger validation (e.g., by clicking submit)
    await clickDevExtremeButton(page, '#submit-button');

    // Wait for validation
    const validation = await waitForDevExtremeValidation(
      page,
      '#email-input'
    );
    expect(validation.isValid).toBe(false);
    expect(validation.message).toBeTruthy();
  });

  test('should get all validation messages from validation group', async ({ page }) => {
    const formSelector = '#my-form';

    // Fill form with invalid data
    await fillDevExtremeInput(page, '#name-input', '');
    await fillDevExtremeInput(page, '#email-input', 'invalid-email');
    await fillDevExtremeInput(page, '#phone-input', '123');

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
    await fillDevExtremeInput(page, '#email-input', 'valid@email.com');
    await clickDevExtremeButton(page, '#submit-button');

    const validation = await waitForDevExtremeValidation(
      page,
      '#email-input'
    );
    expect(validation.isValid).toBe(true);
  });

  test('should get validation messages without selector', async ({ page }) => {
    // Get messages from default validation group
    await clickDevExtremeButton(page, '#submit-button');

    const messages = await getDevExtremeValidationMessages(page);
    // Assert based on your test requirements
    expect(Array.isArray(messages)).toBe(true);
  });
});



