import { Page } from '@playwright/test';
import { waitForDevExtremeComponent } from '../core/component';

/**
 * DevExtreme DataGrid component helpers
 */

export interface DataGridOptions {
  timeout?: number;
}

/**
 * Wait for DevExtreme DataGrid to finish loading data
 */
export async function waitForDevExtremeDataGridLoad(
  page: Page,
  gridSelector: string,
  options?: DataGridOptions
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
  options?: DataGridOptions
): Promise<string> {
  const timeout = options?.timeout ?? 10000;

  await waitForDevExtremeDataGridLoad(page, gridSelector, { timeout });

  return await page.evaluate(
    (params: [string, number, number | string]) => {
      const [sel, rowIdx, colIdx] = params;
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
    [gridSelector, rowIndex, columnIndex] as [string, number, number | string]
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
  options?: DataGridOptions
): Promise<void> {
  const timeout = options?.timeout ?? 10000;

  await waitForDevExtremeDataGridLoad(page, gridSelector, { timeout });

  const cellHandle = await page.evaluateHandle(
    (params: [string, number, number | string]) => {
      const [sel, rowIdx, colIdx] = params;
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
    [gridSelector, rowIndex, columnIndex] as [string, number, number | string]
  );

  if (cellHandle && cellHandle.asElement()) {
    // Use the element handle to click directly
    await cellHandle.asElement()!.click({ timeout });
  } else {
    throw new Error(`Cell not found at row ${rowIndex}, column ${columnIndex}`);
  }
}

