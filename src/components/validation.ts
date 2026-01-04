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
 * DevExtreme Validation component helpers
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Wait for DevExtreme validation to complete
 */
export async function waitForDevExtremeValidation(
  page: Page,
  componentSelector: string,
  options?: { timeout?: number }
): Promise<ValidationResult> {
  const timeout = options?.timeout ?? 5000;

  await waitForDevExtremeComponent(page, componentSelector, { timeout });

  return await page.evaluate(
    (sel) => {
      const component = document.querySelector(sel);
      if (!component) {
        return { isValid: false, message: 'Component not found' };
      }

      const isValid = !component.classList.contains('dx-invalid');
      const messageElement = component.querySelector('.dx-invalid-message');
      const message = messageElement?.textContent?.trim();

      return { isValid, message };
    },
    componentSelector
  );
}

/**
 * Get all validation messages from a DevExtreme ValidationGroup
 */
export async function getDevExtremeValidationMessages(
  page: Page,
  validationGroupSelector?: string
): Promise<string[]> {
  const selector = validationGroupSelector || '.dx-validationgroup';
  
  return await page.evaluate(
    (sel) => {
      const group = document.querySelector(sel);
      if (!group) return [];

      const messages: string[] = [];
      const invalidMessages = group.querySelectorAll('.dx-invalid-message');
      
      invalidMessages.forEach((msg: Element) => {
        const text = msg.textContent?.trim();
        if (text) messages.push(text);
      });

      return messages;
    },
    selector
  );
}

