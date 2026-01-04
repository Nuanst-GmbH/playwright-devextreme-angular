/**
 * Copyright 2025 Nuanst-GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    // For value-based selection, try multiple strategies
    // DevExtreme uses data-value or the actual value in the item
    const option = page.locator(
      `.dx-list-item[data-value="${value}"], .dx-item[data-value="${value}"], .dx-list-item:has-text("${value}")`
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

