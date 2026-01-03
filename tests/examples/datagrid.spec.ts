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
    // Navigate to your application
    // await page.goto('http://localhost:4200');
  });

  test.skip('should wait for grid to load and get cell value by index', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    // Wait for grid to load data
    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Get cell value by row and column index
    const cellValue = await getDevExtremeDataGridCellValue(
      page,
      gridSelector,
      0,
      1
    );
    expect(cellValue).toBeTruthy();
  });

  test.skip('should get cell value by column name', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Get cell value by column name
    const cellValue = await getDevExtremeDataGridCellValue(
      page,
      gridSelector,
      0,
      'columnName'
    );
    expect(cellValue).toBeTruthy();
  });

  test.skip('should click a cell by index', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Click a cell
    await clickDevExtremeDataGridCell(page, gridSelector, 0, 1);
  });

  test.skip('should click a cell by column name', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Click a cell by column name
    await clickDevExtremeDataGridCell(page, gridSelector, 0, 'columnName');
  });

  test.skip('should handle multiple rows', async ({ page }) => {
    const gridSelector = '#my-datagrid';

    await waitForDevExtremeDataGridLoad(page, gridSelector);

    // Get values from multiple rows
    const row0Value = await getDevExtremeDataGridCellValue(
      page,
      gridSelector,
      0,
      0
    );
    const row1Value = await getDevExtremeDataGridCellValue(
      page,
      gridSelector,
      1,
      0
    );

    expect(row0Value).toBeTruthy();
    expect(row1Value).toBeTruthy();
  });
});


