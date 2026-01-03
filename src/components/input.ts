import { Page } from '@playwright/test';
import { waitForDevExtremeComponent } from '../core/component';

/**
 * DevExtreme Input/Editor component helpers
 */

export interface InputOptions {
  timeout?: number;
  clear?: boolean;
}

/**
 * Fill a DevExtreme text input/editor, handling Shadow DOM
 */
export async function fillDevExtremeInput(
  page: Page,
  inputSelector: string,
  value: string,
  options?: InputOptions
): Promise<void> {
  const timeout = options?.timeout ?? 5000;
  const clear = options?.clear ?? true;

  // Wait for input to be ready
  const input = await waitForDevExtremeComponent(page, inputSelector, { timeout });

  // DevExtreme inputs may have nested input elements
  const actualInput = input.locator('input, textarea').first();
  await actualInput.waitFor({ state: 'visible', timeout });

  if (clear) {
    await actualInput.clear({ timeout });
  }

  await actualInput.fill(value, { timeout });

  // Trigger input event to ensure DevExtreme updates
  await actualInput.dispatchEvent('input');
  await actualInput.dispatchEvent('change');
}

/**
 * Get the value from a DevExtreme editor/input
 */
export async function getDevExtremeValue(
  page: Page,
  editorSelector: string,
  options?: { timeout?: number }
): Promise<string> {
  const timeout = options?.timeout ?? 5000;

  await waitForDevExtremeComponent(page, editorSelector, { timeout });

  const value = await page.evaluate(
    (sel) => {
      const editor = document.querySelector(sel);
      if (!editor) return '';

      // Try to find input element
      const input = editor.querySelector('input, textarea');
      if (input) {
        return (input as HTMLInputElement).value;
      }

      // Try to get value from data attribute
      const dataValue = editor.getAttribute('data-value');
      if (dataValue) return dataValue;

      // Try to get text content
      return editor.textContent?.trim() || '';
    },
    editorSelector
  );

  return value;
}

