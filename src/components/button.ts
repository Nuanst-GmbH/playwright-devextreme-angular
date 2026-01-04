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
 * DevExtreme Button component helpers
 */

export interface ButtonOptions {
  timeout?: number;
  force?: boolean;
}

/**
 * Click a DevExtreme button, handling Shadow DOM and dynamic rendering
 */
export async function clickDevExtremeButton(
  page: Page,
  buttonSelector: string,
  options?: ButtonOptions
): Promise<void> {
  const timeout = options?.timeout ?? 5000;
  const force = options?.force ?? false;

  // Wait for button to be ready
  const button = await waitForDevExtremeComponent(page, buttonSelector, { timeout });
  
  // DevExtreme buttons may be disabled initially
  // Wait for button to be enabled - we need to check both:
  // 1. Standard HTML disabled attribute (Playwright's isEnabled() handles this)
  // 2. DevExtreme's custom dx-state-disabled class (requires DOM access)
  // Using page.waitForFunction is appropriate here for component-specific state checking
  await page.waitForFunction(
    (sel) => {
      const btn = document.querySelector(sel);
      if (!btn) return false;
      const isDisabled = btn.hasAttribute('disabled') || 
                        btn.classList.contains('dx-state-disabled');
      return !isDisabled;
    },
    buttonSelector,
    { timeout }
  );

  await button.click({ force, timeout });
}

