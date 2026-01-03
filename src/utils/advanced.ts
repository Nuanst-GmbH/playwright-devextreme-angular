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

