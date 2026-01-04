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
 * DevExtreme DataGrid component helpers
 */

export interface DataGridOptions {
  timeout?: number;
  columnName?: string; // Column name (dataField) for lookup
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
 * 
 * @param page - Playwright page object
 * @param gridSelector - CSS selector for the DataGrid
 * @param rowIndex - Zero-based row index
 * @param columnIndex - Zero-based column index (if columnName is not provided)
 * @param options - Optional configuration including columnName for lookup by dataField
 * @returns The cell value as a string
 */
export async function getDevExtremeDataGridCellValue(
  page: Page,
  gridSelector: string,
  rowIndex: number,
  columnIndex: number,
  options?: DataGridOptions
): Promise<string> {
  const timeout = options?.timeout ?? 10000;
  const columnName = options?.columnName;

  await waitForDevExtremeDataGridLoad(page, gridSelector, { timeout });

  // Find rows using Playwright locators
  const rowsView = page.locator(`${gridSelector} .dx-datagrid-rowsview, ${gridSelector} .dx-scrollable-content`);
  const rows = rowsView.locator('.dx-row, .dx-data-row, tr[role="row"]');
  const rowCount = await rows.count();

  if (rowIndex >= rowCount) {
    throw new Error(`Row index ${rowIndex} is out of bounds. Grid has ${rowCount} rows.`);
  }

  const row = rows.nth(rowIndex);
  let cellLocator: ReturnType<Page['locator']> | undefined;

  // If columnName is provided, use it for lookup; otherwise use columnIndex
  if (columnName) {
    // DevExtreme DataGrid doesn't store column names in data row cells
    // We need to find the column index by looking up the header, then use that index
    const columnIndexFromHeader = await findColumnIndexByHeader(
      page,
      gridSelector,
      columnName
    );

    if (columnIndexFromHeader >= 0) {
      // Use the column index to get the cell
      const allCells = row.locator('.dx-datagrid-cell, td[role="gridcell"]');
      const cellCount = await allCells.count();
      if (columnIndexFromHeader < cellCount) {
        cellLocator = allCells.nth(columnIndexFromHeader);
      } else {
        throw new Error(`Column "${columnName}" found in header but index ${columnIndexFromHeader} is out of bounds. Row has ${cellCount} cells.`);
      }
    } else {
      throw new Error(`Column "${columnName}" not found in grid headers.`);
    }
  } else {
    // Use columnIndex (numeric)
    // Get all data cells, filtering out command/selection cells
    const allCells = row.locator('.dx-datagrid-cell, td[role="gridcell"], .dx-cell');
    const cellCount = await allCells.count();

    if (columnIndex >= cellCount) {
      throw new Error(`Column index ${columnIndex} is out of bounds. Row has ${cellCount} cells.`);
    }

    // Try to filter out command/selection cells by checking each cell
    let dataCellIndex = 0;
    let foundCell = false;
    
    for (let i = 0; i < cellCount; i++) {
      const cell = allCells.nth(i);
      const classes = await cell.getAttribute('class').catch(() => '');
      
      // Skip command/selection cells
      if (classes && (classes.includes('dx-command-column') || classes.includes('dx-selection'))) {
        continue;
      }
      
      if (dataCellIndex === columnIndex) {
        cellLocator = cell;
        foundCell = true;
        break;
      }
      dataCellIndex++;
    }
    
    // Fallback to direct index if filtering didn't work
    if (!foundCell) {
      cellLocator = allCells.nth(columnIndex);
    }
  }

  // Ensure cellLocator is defined (TypeScript guard)
  if (!cellLocator) {
    throw new Error(`Cell not found at row ${rowIndex}, column ${columnIndex}`);
  }

  // Get text content using innerText (most reliable for visible text)
  try {
    const text = await cellLocator.innerText({ timeout });
    if (text.trim()) {
      return text.trim();
    }
  } catch {
    // Fallback to textContent if innerText fails
  }

  // Try nested elements if direct text is empty
  const nestedText = cellLocator.locator('.dx-datagrid-text-content, .dx-cell-value, .dx-text-content');
  const nestedCount = await nestedText.count();
  if (nestedCount > 0) {
    const text = await nestedText.first().textContent({ timeout }).catch(() => '');
    if (text) return text.trim();
  }

  // Final fallback: get textContent directly
  const text = await cellLocator.textContent({ timeout }).catch(() => '');
  return text?.trim() || '';
}

/**
 * Helper function to find column index by header name
 * Uses Playwright locators for better reliability
 */
async function findColumnIndexByHeader(
  page: Page,
  gridSelector: string,
  columnName: string
): Promise<number> {
  // Based on DevExtreme HTML structure:
  // - Headers have id="dx-col-1", id="dx-col-2", etc.
  // - Headers have aria-label="Column ID", "Column Name", etc. (caption)
  // - Headers have text content like "ID", "Name" (caption)
  // - Headers may have data-field attribute (the actual dataField from column definition)
  // - Data cells have aria-describedby="dx-col-1" which references the header ID
  
  // Use page.evaluate to inspect the actual DOM structure
  return await page.evaluate(
    ([sel, colName]) => {
      const grid = document.querySelector(sel) as HTMLElement;
      if (!grid) return -1;

      // Try multiple header selectors to find the header row
      // Based on the HTML structure, headers are: td[role="columnheader"]
      const headerSelectors = [
        '.dx-datagrid-headers .dx-header-row td[role="columnheader"]',
        '.dx-header-row td[role="columnheader"]',
        '.dx-datagrid-headers td[role="columnheader"]',
        'thead td[role="columnheader"]'
      ];

      for (const selector of headerSelectors) {
        const headers = grid.querySelectorAll(selector);
        
        for (let i = 0; i < headers.length; i++) {
          const header = headers[i] as HTMLElement;
          
          // Priority 1: Check data-field attribute (most reliable - this is the actual dataField from column definition)
          const dataField = header.getAttribute('data-field') || '';
          if (dataField.toLowerCase() === colName.toLowerCase()) {
            return i;
          }
          
          // Priority 2: Check aria-label (contains "Column Name" format, e.g., "Column Name")
          const ariaLabel = header.getAttribute('aria-label') || '';
          if (ariaLabel.toLowerCase().includes(colName.toLowerCase())) {
            return i;
          }
          
          // Priority 3: Check text content (caption like "Name")
          const headerText = header.textContent?.toLowerCase().trim() || '';
          if (headerText === colName.toLowerCase()) {
            return i;
          }
          
          // Priority 4: Check nested text content (in .dx-datagrid-text-content)
          const nestedText = header.querySelector('.dx-datagrid-text-content');
          if (nestedText) {
            const nestedTextContent = nestedText.textContent?.toLowerCase().trim() || '';
            if (nestedTextContent === colName.toLowerCase()) {
              return i;
            }
          }
          
          // Priority 5: Check all attributes for the column name
          for (const attr of Array.from(header.attributes)) {
            if (attr.value.toLowerCase().includes(colName.toLowerCase())) {
              return i;
            }
          }
        }
      }

      return -1;
    },
    [gridSelector, columnName] as [string, string]
  );
}

/**
 * Click a cell in DevExtreme DataGrid
 */
export async function clickDevExtremeDataGridCell(
  page: Page,
  gridSelector: string,
  rowIndex: number,
  columnIndex: number,
  options?: DataGridOptions
): Promise<void> {
  const timeout = options?.timeout ?? 10000;

  await waitForDevExtremeDataGridLoad(page, gridSelector, { timeout });

  // Find rows using Playwright locators
  const rowsView = page.locator(`${gridSelector} .dx-datagrid-rowsview, ${gridSelector} .dx-scrollable-content`);
  const rows = rowsView.locator('.dx-row, .dx-data-row, tr[role="row"]');
  const rowCount = await rows.count();

  if (rowIndex >= rowCount) {
    throw new Error(`Row index ${rowIndex} is out of bounds. Grid has ${rowCount} rows.`);
  }

  const row = rows.nth(rowIndex);
  let cellLocator: ReturnType<Page['locator']> | undefined;
  const columnName = options?.columnName;

  // If columnName is provided, use it for lookup; otherwise use columnIndex
  if (columnName) {
    // DevExtreme DataGrid doesn't store column names in data row cells
    // We need to find the column index by looking up the header, then use that index
    const columnIndexFromHeader = await findColumnIndexByHeader(
      page,
      gridSelector,
      columnName
    );

    if (columnIndexFromHeader >= 0) {
      // Use the column index to get the cell
      // Data cells use td[role="gridcell"] and have aria-describedby pointing to header IDs
      const allCells = row.locator('td[role="gridcell"]');
      const cellCount = await allCells.count();
      if (columnIndexFromHeader < cellCount) {
        cellLocator = allCells.nth(columnIndexFromHeader);
      } else {
        throw new Error(`Column "${columnName}" found in header but index ${columnIndexFromHeader} is out of bounds. Row has ${cellCount} cells.`);
      }
    } else {
      throw new Error(`Column "${columnName}" not found in grid headers.`);
    }
  } else {
    // Use columnIndex (numeric)
    // Get all data cells, filtering out command/selection cells
    const allCells = row.locator('.dx-datagrid-cell, td[role="gridcell"], .dx-cell');
    const cellCount = await allCells.count();

    if (columnIndex >= cellCount) {
      throw new Error(`Column index ${columnIndex} is out of bounds. Row has ${cellCount} cells.`);
    }

    // Try to filter out command/selection cells by checking each cell
    // We'll use a simple approach: try to get the cell at the index, and if it's a command cell, skip it
    let dataCellIndex = 0;
    let foundCell = false;
    
    for (let i = 0; i < cellCount; i++) {
      const cell = allCells.nth(i);
      const classes = await cell.getAttribute('class').catch(() => '');
      
      // Skip command/selection cells
      if (classes && (classes.includes('dx-command-column') || classes.includes('dx-selection'))) {
        continue;
      }
      
      if (dataCellIndex === columnIndex) {
        cellLocator = cell;
        foundCell = true;
        break;
      }
      dataCellIndex++;
    }
    
    // Fallback to direct index if filtering didn't work
    if (!foundCell) {
      cellLocator = allCells.nth(columnIndex);
    }
  }

  // Ensure cellLocator is defined (TypeScript guard)
  if (!cellLocator) {
    throw new Error(`Cell not found at row ${rowIndex}, column ${columnIndex}`);
  }

  // Click the cell using Playwright locator
  await cellLocator.click({ timeout });
}

