import { Page } from '@playwright/test';
import { waitForDevExtremeComponent } from '../core/component';

/**
 * DevExtreme component state checking utilities
 */

export type ComponentState = 'disabled' | 'readonly' | 'visible' | 'hidden';

/**
 * Check if a DevExtreme component is in a specific state (disabled, readonly, etc.)
 */
export async function isDevExtremeComponentInState(
  page: Page,
  componentSelector: string,
  state: ComponentState,
  options?: { timeout?: number }
): Promise<boolean> {
  const timeout = options?.timeout ?? 5000;

  try {
    await waitForDevExtremeComponent(page, componentSelector, { timeout });

    return await page.evaluate(
      ([sel, st]) => {
        const component = document.querySelector(sel);
        if (!component) return false;

        switch (st) {
          case 'disabled':
            return component.hasAttribute('disabled') ||
                   component.classList.contains('dx-state-disabled');
          case 'readonly':
            return component.hasAttribute('readonly') ||
                   component.classList.contains('dx-state-readonly');
          case 'visible':
            return (component as HTMLElement).offsetParent !== null &&
                   !component.classList.contains('dx-state-invisible');
          case 'hidden':
            return (component as HTMLElement).offsetParent === null ||
                   component.classList.contains('dx-state-invisible');
          default:
            return false;
        }
      },
      [componentSelector, state]
    );
  } catch {
    return false;
  }
}

