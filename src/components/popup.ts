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

import { Page, Locator } from '@playwright/test';

/**
 * DevExtreme Popup/Modal component helpers
 */

export interface PopupOptions {
  timeout?: number;
  title?: string;
  useCloseButton?: boolean;
}

/**
 * Wait for a DevExtreme popup/modal to appear
 */
export async function waitForDevExtremePopup(
  page: Page,
  options?: PopupOptions
): Promise<Locator> {
  const timeout = options?.timeout ?? 10000;
  const title = options?.title;

  let selector = '.dx-popup-wrapper, .dx-overlay-wrapper';
  if (title) {
    selector += `:has-text("${title}")`;
  }

  await page.waitForSelector(selector, { state: 'visible', timeout });
  return page.locator(selector).first();
}

/**
 * Close a DevExtreme popup/modal
 */
export async function closeDevExtremePopup(
  page: Page,
  options?: PopupOptions
): Promise<void> {
  const timeout = options?.timeout ?? 5000;
  const useCloseButton = options?.useCloseButton ?? true;

  if (useCloseButton) {
    const closeButton = page.locator(
      '.dx-popup-wrapper .dx-closebutton, .dx-overlay-wrapper .dx-closebutton'
    ).first();
    await closeButton.waitFor({ state: 'visible', timeout });
    await closeButton.click({ timeout });
  } else {
    // Press Escape key
    await page.keyboard.press('Escape');
  }

  // Wait for popup to close
  await page.waitForSelector(
    '.dx-popup-wrapper, .dx-overlay-wrapper',
    { state: 'hidden', timeout }
  );
}

