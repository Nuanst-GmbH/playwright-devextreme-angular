import { test, expect } from '@playwright/test';
import {
  waitForDevExtremeDataGridLoad,
  getDevExtremeDataGridCellValue,
  clickDevExtremeDataGridCell,
} from '@playwright-devextreme/helpers';

/**
 * Example tests for DevExtreme DataGrid component
 */

test.describe('DevExtreme DataGrid Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sample application
    await page.goto('http://localhost:4200');
  });

  test('should wait for grid to load and get cell value by index', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    // Wait for grid to load data
    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Get cell value by row and column index (column 1 = name)
    const cellValue = await getDevExtremeDataGridCellValue(
      page,
      gridSelector,
      0,
      1
    );
    expect(cellValue).toBeTruthy();
    expect(cellValue).toEqual('John Doe');
  });

  test('should get cell value by column name', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Get cell value by column name using the new columnName option
    const cellValue = await getDevExtremeDataGridCellValue(
      page,
      gridSelector,
      0,
      0, // columnIndex (ignored when columnName is provided)
      { columnName: 'name' }
    );
    expect(cellValue).toBeTruthy();
    expect(cellValue).toEqual('John Doe');
  });

  test('should click a cell by index', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Click a cell
    await clickDevExtremeDataGridCell(page, gridSelector, 0, 1);
  });

  test('should click a cell by column name', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Click a cell by column name using the new columnName option
    await clickDevExtremeDataGridCell(page, gridSelector, 0, 0, { columnName: 'name' });
  });

  test('should handle multiple rows', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Get values from multiple rows (column 0 = id, column 1 = name)
    const row0Id = await getDevExtremeDataGridCellValue(
      page,
      gridSelector,
      0,
      0
    );
    const row0Name = await getDevExtremeDataGridCellValue(
      page,
      gridSelector,
      0,
      1
    );
    const row1Name = await getDevExtremeDataGridCellValue(
      page,
      gridSelector,
      1,
      1
    );

    expect(row0Id).toEqual('1');
    expect(row0Name).toEqual('John Doe');
    expect(row1Name).toEqual('Jane Smith');
  });
});



