import { Page } from '@playwright/test';
import { waitForDevExtremeComponent } from '../core/component';

/**
 * DevExtreme Dropdown/SelectBox component helpers
 */

export interface DropdownOptions {
  timeout?: number;
  byText?: boolean;
}

/**
 * Select a value from a DevExtreme SelectBox/DropDownBox
 */
export async function selectDevExtremeDropdown(
  page: Page,
  dropdownSelector: string,
  value: string | number,
  options?: DropdownOptions
): Promise<void> {
  const timeout = options?.timeout ?? 10000;
  const byText = options?.byText ?? true;

  // Wait for dropdown to be ready
  await waitForDevExtremeComponent(page, dropdownSelector, { timeout });

  // Click to open dropdown
  const dropdown = page.locator(dropdownSelector);
  await dropdown.click({ timeout });

  // Wait for dropdown popup to appear
  await page.waitForSelector('.dx-popup-wrapper, .dx-dropdownlist-popup', {
    state: 'visible',
    timeout
  });

  // Find and click the option
  if (byText) {
    const option = page.locator(
      `.dx-list-item:has-text("${value}"), .dx-item:has-text("${value}")`
    ).first();
    await option.waitFor({ state: 'visible', timeout });
    await option.click({ timeout });
  } else {
    const option = page.locator(
      `.dx-list-item[data-value="${value}"], .dx-item[data-value="${value}"]`
    ).first();
    await option.waitFor({ state: 'visible', timeout });
    await option.click({ timeout });
  }

  // Wait for dropdown to close
  await page.waitForSelector('.dx-popup-wrapper, .dx-dropdownlist-popup', {
    state: 'hidden',
    timeout
  });
}

