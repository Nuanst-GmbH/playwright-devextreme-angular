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
  await page.waitForFunction(
    (sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      
      // Check if DevExtreme has initialized (common indicators)
      const hasDxClass = element.classList.toString().includes('dx-');
      const hasDxWidget = element.hasAttribute('dx-widget') || 
                         element.querySelector('[dx-widget]') !== null;
      
      return hasDxClass || hasDxWidget;
    },
    selector,
    { timeout }
  );

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
  // First, try to find in Shadow DOM
  const shadowRoot = await page.evaluateHandle(
    (hostSel) => {
      const host = document.querySelector(hostSel);
      if (!host) return null;
      return host.shadowRoot;
    },
    hostSelector
  );

  if (shadowRoot && shadowRoot.asElement()) {
    // Shadow DOM exists, use evaluate to find element
    const element = await page.evaluateHandle(
      ([hostSel, innerSel]) => {
        const host = document.querySelector(hostSel);
        if (!host || !host.shadowRoot) return null;
        return host.shadowRoot.querySelector(innerSel);
      },
      [hostSelector, innerSelector]
    );

    if (element && element.asElement()) {
      // Return a locator that can work with the shadow element
      // Note: Playwright's locator API doesn't directly support shadow DOM,
      // so we'll use a workaround with data attributes or use evaluate
      return page.locator(`${hostSelector} >> ${innerSelector}`);
    }
  }

  // Fallback to regular DOM search
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

  await waitForDevExtremeComponent(page, componentSelector, { timeout });

  await page.waitForFunction(
    (sel) => {
      const component = document.querySelector(sel);
      if (!component) return false;

      // Check for loading indicators
      const loadingIndicators = component.querySelectorAll(
        '.dx-loadpanel, .dx-loadindicator, .dx-state-loading'
      );
      
      for (const indicator of Array.from(loadingIndicators)) {
        const isVisible = (indicator as HTMLElement).offsetParent !== null;
        if (isVisible) return false;
      }

      // Check if component is in loading state
      if (component.classList.contains('dx-state-loading')) {
        return false;
      }

      return true;
    },
    componentSelector,
    { timeout, polling: checkInterval }
  );
}

