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
import type { ComponentWaitOptions } from '../types';

/**
 * Core component utilities for DevExtreme components
 * Handles component initialization and Shadow DOM interactions
 */

/**
 * Wait for a DevExtreme component to be fully initialized and rendered
 * DevExtreme components often render asynchronously and may use Shadow DOM
 */
export async function waitForDevExtremeComponent(
  page: Page,
  selector: string,
  options?: ComponentWaitOptions
): Promise<Locator> {
  const timeout = options?.timeout ?? 5000;
  const state = options?.state ?? 'visible';

  // Wait for the component element to be in the DOM
  const component = page.locator(selector);
  await component.waitFor({ state, timeout });

  // Wait for DevExtreme initialization (components often add data attributes or classes)
  // Use locator.evaluate() instead of page.waitForFunction() with document.querySelector
  await component.waitFor({
    state: 'attached',
    timeout
  });

  // Check if DevExtreme has initialized using locator evaluate
  await component.evaluate((el) => {
    const hasDxClass = el.classList.toString().includes('dx-');
    const hasDxWidget = el.hasAttribute('dx-widget') || 
                       el.querySelector('[dx-widget]') !== null;
    return hasDxClass || hasDxWidget;
  }).catch(async () => {
    // Fallback: wait for any dx- class or dx-widget to appear
    const dxElement = component.locator('[class*="dx-"], [dx-widget]').first();
    await dxElement.waitFor({ state: 'attached', timeout });
  });

  return component;
}

/**
 * Find an element within a DevExtreme component's Shadow DOM
 * Falls back to regular DOM if Shadow DOM is not present
 */
export async function findInShadowDOM(
  page: Page,
  hostSelector: string,
  innerSelector: string
): Promise<Locator> {
  const host = page.locator(hostSelector);
  
  // First, try to check if Shadow DOM exists using locator evaluate
  const hasShadowDOM = await host.evaluate((el) => {
    return el.shadowRoot !== null;
  }).catch(() => false);

  if (hasShadowDOM) {
    // Shadow DOM exists - Playwright locators can't directly access shadow DOM,
    // but we can use a workaround: try to find the element using the piercing combinator
    // or use evaluate to find it and mark it with a data attribute
    try {
      // Try using the piercing combinator (>>) which works for some shadow DOM cases
      const shadowElement = page.locator(`${hostSelector} >> ${innerSelector}`);
      await shadowElement.waitFor({ state: 'attached', timeout: 1000 });
      return shadowElement;
    } catch {
      // If piercing combinator doesn't work, we need to use evaluate
      // This is a limitation of Playwright's locator API with Shadow DOM
      const elementHandle = await host.evaluateHandle((el, innerSel) => {
        if (!el.shadowRoot) return null;
        return el.shadowRoot.querySelector(innerSel);
      }, innerSelector);
      
      if (elementHandle && elementHandle.asElement()) {
        // Return a locator using the piercing combinator as fallback
        return page.locator(`${hostSelector} >> ${innerSelector}`);
      }
    }
  }

  // Fallback to regular DOM search (most common case for DevExtreme)
  return page.locator(`${hostSelector} ${innerSelector}`);
}

/**
 * Wait for DevExtreme component to finish an async operation
 * Useful for components that load data or perform calculations
 */
export async function waitForDevExtremeAsyncOperation(
  page: Page,
  componentSelector: string,
  options?: { timeout?: number; checkInterval?: number }
): Promise<void> {
  const timeout = options?.timeout ?? 30000;
  const checkInterval = options?.checkInterval ?? 500;

  const component = await waitForDevExtremeComponent(page, componentSelector, { timeout });

  // Wait for async operation to complete using Playwright locators
  // Use locator.evaluate() with polling instead of page.waitForFunction()
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const isReady = await component.evaluate((el) => {
      // Check for loading indicators
      const loadingIndicators = el.querySelectorAll(
        '.dx-loadpanel, .dx-loadindicator, .dx-state-loading'
      );
      
      for (const indicator of Array.from(loadingIndicators)) {
        const isVisible = (indicator as HTMLElement).offsetParent !== null;
        if (isVisible) return false;
      }

      // Check if component is in loading state
      if (el.classList.contains('dx-state-loading')) {
        return false;
      }

      return true;
    }).catch(() => false);

    if (isReady) {
      return;
    }

    await page.waitForTimeout(checkInterval);
  }

  // If we get here, timeout was reached
  throw new Error(`Async operation did not complete within ${timeout}ms`);
}

