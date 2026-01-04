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

/**
 * Advanced DevExtreme component utilities
 * For accessing component instances and executing methods
 */

/**
 * Execute a DevExtreme component method via Angular component instance
 * This is useful for triggering component methods that aren't directly accessible
 */
export async function executeDevExtremeComponentMethod(
  page: Page,
  componentSelector: string,
  methodName: string,
  ...args: any[]
): Promise<any> {
  return await page.evaluate(
    (params: [string, string, any[]]) => {
      const [sel, method, methodArgs] = params;
      const element = document.querySelector(sel);
      if (!element) {
        throw new Error(`Component not found: ${sel}`);
      }

      // Try to access Angular component instance
      // This works if the component exposes the DevExtreme instance
      const ngComponent = (element as any).__ngContext__;
      if (ngComponent) {
        const componentInstance = ngComponent[8]; // Angular component instance
        if (componentInstance && componentInstance.instance) {
          const dxInstance = componentInstance.instance as any;
          if (typeof dxInstance[method] === 'function') {
            return dxInstance[method](...methodArgs);
          }
        }
      }

      // Fallback: try to get DevExtreme instance directly
      const dxInstance = (element as any).dxInstance as any;
      if (dxInstance && typeof dxInstance[method] === 'function') {
        return dxInstance[method](...methodArgs);
      }

      throw new Error(`Method ${method} not found on component`);
    },
    [componentSelector, methodName, args] as [string, string, any[]]
  );
}

