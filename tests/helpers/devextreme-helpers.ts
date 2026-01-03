import { Page, Locator, expect } from '@playwright/test';

/**
 * Helper functions for testing DevExtreme Angular components with Playwright
 * These functions handle Shadow DOM, dynamic rendering, and component-specific interactions
 */

/**
 * Wait for a DevExtreme component to be fully initialized and rendered
 * DevExtreme components often render asynchronously and may use Shadow DOM
 */
export async function waitForDevExtremeComponent(
  page: Page,
  selector: string,
  options?: { timeout?: number; state?: 'attached' | 'visible' | 'hidden' }
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
 * Click a DevExtreme button, handling Shadow DOM and dynamic rendering
 */
export async function clickDevExtremeButton(
  page: Page,
  buttonSelector: string,
  options?: { timeout?: number; force?: boolean }
): Promise<void> {
  const timeout = options?.timeout ?? 5000;
  const force = options?.force ?? false;

  // Wait for button to be ready
  const button = await waitForDevExtremeComponent(page, buttonSelector, { timeout });
  
  // DevExtreme buttons may be disabled initially
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

/**
 * Fill a DevExtreme text input/editor, handling Shadow DOM
 */
export async function fillDevExtremeInput(
  page: Page,
  inputSelector: string,
  value: string,
  options?: { timeout?: number; clear?: boolean }
): Promise<void> {
  const timeout = options?.timeout ?? 5000;
  const clear = options?.clear ?? true;

  // Wait for input to be ready
  const input = await waitForDevExtremeComponent(page, inputSelector, { timeout });

  // DevExtreme inputs may have nested input elements
  const actualInput = input.locator('input, textarea').first();
  await actualInput.waitFor({ state: 'visible', timeout });

  if (clear) {
    await actualInput.clear({ timeout });
  }

  await actualInput.fill(value, { timeout });

  // Trigger input event to ensure DevExtreme updates
  await actualInput.dispatchEvent('input');
  await actualInput.dispatchEvent('change');
}

/**
 * Select a value from a DevExtreme SelectBox/DropDownBox
 */
export async function selectDevExtremeDropdown(
  page: Page,
  dropdownSelector: string,
  value: string | number,
  options?: { timeout?: number; byText?: boolean }
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

/**
 * Get the value from a DevExtreme editor/input
 */
export async function getDevExtremeValue(
  page: Page,
  editorSelector: string,
  options?: { timeout?: number }
): Promise<string> {
  const timeout = options?.timeout ?? 5000;

  await waitForDevExtremeComponent(page, editorSelector, { timeout });

  const value = await page.evaluate(
    (sel) => {
      const editor = document.querySelector(sel);
      if (!editor) return '';

      // Try to find input element
      const input = editor.querySelector('input, textarea');
      if (input) {
        return (input as HTMLInputElement).value;
      }

      // Try to get value from data attribute
      const dataValue = editor.getAttribute('data-value');
      if (dataValue) return dataValue;

      // Try to get text content
      return editor.textContent?.trim() || '';
    },
    editorSelector
  );

  return value;
}

/**
 * Check if a DevExtreme component is in a specific state (disabled, readonly, etc.)
 */
export async function isDevExtremeComponentInState(
  page: Page,
  componentSelector: string,
  state: 'disabled' | 'readonly' | 'visible' | 'hidden',
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
            return component.offsetParent !== null &&
                   !component.classList.contains('dx-state-invisible');
          case 'hidden':
            return component.offsetParent === null ||
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

/**
 * Wait for DevExtreme DataGrid to finish loading data
 */
export async function waitForDevExtremeDataGridLoad(
  page: Page,
  gridSelector: string,
  options?: { timeout?: number }
): Promise<void> {
  const timeout = options?.timeout ?? 30000;

  await waitForDevExtremeComponent(page, gridSelector, { timeout });

  // Wait for loading indicator to disappear
  await page.waitForFunction(
    (sel) => {
      const grid = document.querySelector(sel);
      if (!grid) return false;

      const loadingIndicator = grid.querySelector('.dx-loadpanel, .dx-loadindicator');
      if (!loadingIndicator) return true;

      const isVisible = (loadingIndicator as HTMLElement).offsetParent !== null;
      return !isVisible;
    },
    gridSelector,
    { timeout }
  );

  // Wait for rows to be rendered
  await page.waitForSelector(
    `${gridSelector} .dx-datagrid-rowsview .dx-row`,
    { timeout }
  );
}

/**
 * Get cell value from DevExtreme DataGrid
 */
export async function getDevExtremeDataGridCellValue(
  page: Page,
  gridSelector: string,
  rowIndex: number,
  columnIndex: number | string,
  options?: { timeout?: number }
): Promise<string> {
  const timeout = options?.timeout ?? 10000;

  await waitForDevExtremeDataGridLoad(page, gridSelector, { timeout });

  return await page.evaluate(
    ([sel, rowIdx, colIdx]) => {
      const grid = document.querySelector(sel);
      if (!grid) return '';

      const rows = grid.querySelectorAll('.dx-datagrid-rowsview .dx-row');
      if (rowIdx >= rows.length) return '';

      const row = rows[rowIdx];
      let cell: Element | null = null;

      if (typeof colIdx === 'number') {
        const cells = row.querySelectorAll('.dx-command-cell, .dx-datagrid-cell');
        cell = cells[colIdx] || null;
      } else {
        // Find by data attribute or column name
        cell = row.querySelector(`[aria-describedby*="${colIdx}"], [data-column-name="${colIdx}"]`);
      }

      return cell?.textContent?.trim() || '';
    },
    [gridSelector, rowIndex, columnIndex]
  );
}

/**
 * Click a cell in DevExtreme DataGrid
 */
export async function clickDevExtremeDataGridCell(
  page: Page,
  gridSelector: string,
  rowIndex: number,
  columnIndex: number | string,
  options?: { timeout?: number }
): Promise<void> {
  const timeout = options?.timeout ?? 10000;

  await waitForDevExtremeDataGridLoad(page, gridSelector, { timeout });

  const cell = await page.evaluateHandle(
    ([sel, rowIdx, colIdx]) => {
      const grid = document.querySelector(sel);
      if (!grid) return null;

      const rows = grid.querySelectorAll('.dx-datagrid-rowsview .dx-row');
      if (rowIdx >= rows.length) return null;

      const row = rows[rowIdx];
      let cell: Element | null = null;

      if (typeof colIdx === 'number') {
        const cells = row.querySelectorAll('.dx-command-cell, .dx-datagrid-cell');
        cell = cells[colIdx] || null;
      } else {
        cell = row.querySelector(`[aria-describedby*="${colIdx}"], [data-column-name="${colIdx}"]`);
      }

      return cell;
    },
    [gridSelector, rowIndex, columnIndex]
  );

  if (cell && cell.asElement()) {
    await (cell.asElement() as Locator).click({ timeout });
  } else {
    throw new Error(`Cell not found at row ${rowIndex}, column ${columnIndex}`);
  }
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
    ([sel, method, methodArgs]) => {
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
          const dxInstance = componentInstance.instance;
          if (typeof dxInstance[method] === 'function') {
            return dxInstance[method](...methodArgs);
          }
        }
      }

      // Fallback: try to get DevExtreme instance directly
      const dxInstance = (element as any).dxInstance;
      if (dxInstance && typeof dxInstance[method] === 'function') {
        return dxInstance[method](...methodArgs);
      }

      throw new Error(`Method ${method} not found on component`);
    },
    [componentSelector, methodName, args]
  );
}

/**
 * Wait for a DevExtreme popup/modal to appear
 */
export async function waitForDevExtremePopup(
  page: Page,
  options?: { timeout?: number; title?: string }
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
  options?: { timeout?: number; useCloseButton?: boolean }
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

/**
 * Wait for DevExtreme validation to complete
 */
export async function waitForDevExtremeValidation(
  page: Page,
  componentSelector: string,
  options?: { timeout?: number }
): Promise<{ isValid: boolean; message?: string }> {
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
      
      invalidMessages.forEach((msg) => {
        const text = msg.textContent?.trim();
        if (text) messages.push(text);
      });

      return messages;
    },
    selector
  );
}

