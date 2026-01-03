# DevExtreme Playwright Test Helpers

Helper functions for testing DevExtreme Angular components with Playwright, specifically designed to handle Shadow DOM, dynamic rendering, and component-specific behaviors.

## Installation

Make sure you have Playwright installed in your project:

```bash
npm install -D @playwright/test
# or
yarn add -D @playwright/test
```

## Usage

Import the helpers in your test files:

```typescript
import {
  waitForDevExtremeComponent,
  clickDevExtremeButton,
  fillDevExtremeInput,
  // ... other helpers
} from '../helpers';
```

## Available Helpers

### Component Initialization

- **`waitForDevExtremeComponent()`** - Wait for a DevExtreme component to be fully initialized and rendered
- **`waitForDevExtremeAsyncOperation()`** - Wait for async operations (data loading, calculations) to complete

### Interactions

- **`clickDevExtremeButton()`** - Click a DevExtreme button, handling Shadow DOM and dynamic rendering
- **`fillDevExtremeInput()`** - Fill a DevExtreme text input/editor
- **`selectDevExtremeDropdown()`** - Select a value from a DevExtreme SelectBox/DropDownBox
- **`getDevExtremeValue()`** - Get the value from a DevExtreme editor/input

### Data Grid

- **`waitForDevExtremeDataGridLoad()`** - Wait for DataGrid to finish loading data
- **`getDevExtremeDataGridCellValue()`** - Get cell value from DataGrid
- **`clickDevExtremeDataGridCell()`** - Click a cell in DataGrid

### Popups and Modals

- **`waitForDevExtremePopup()`** - Wait for a DevExtreme popup/modal to appear
- **`closeDevExtremePopup()`** - Close a DevExtreme popup/modal

### Validation

- **`waitForDevExtremeValidation()`** - Wait for DevExtreme validation to complete
- **`getDevExtremeValidationMessages()`** - Get all validation messages from a ValidationGroup

### State Checking

- **`isDevExtremeComponentInState()`** - Check if a component is in a specific state (disabled, readonly, etc.)

### Shadow DOM

- **`findInShadowDOM()`** - Find an element within a DevExtreme component's Shadow DOM

### Advanced

- **`executeDevExtremeComponentMethod()`** - Execute a DevExtreme component method via Angular component instance

## Common Patterns

### Basic Component Interaction

```typescript
test('Fill and submit form', async ({ page }) => {
  await waitForDevExtremeComponent(page, '#my-form');
  await fillDevExtremeInput(page, '#name-input', 'John Doe');
  await clickDevExtremeButton(page, '#submit-button');
});
```

### Working with DataGrid

```typescript
test('Verify grid data', async ({ page }) => {
  await waitForDevExtremeDataGridLoad(page, '#my-grid');
  const cellValue = await getDevExtremeDataGridCellValue(page, '#my-grid', 0, 1);
  expect(cellValue).toBe('Expected Value');
});
```

### Handling Popups

```typescript
test('Interact with popup', async ({ page }) => {
  await clickDevExtremeButton(page, '#open-popup');
  await waitForDevExtremePopup(page, { title: 'My Popup' });
  // Interact with popup content
  await closeDevExtremePopup(page);
});
```

### Form Validation

```typescript
test('Validate form', async ({ page }) => {
  await fillDevExtremeInput(page, '#email', 'invalid');
  await clickDevExtremeButton(page, '#submit');
  const validation = await waitForDevExtremeValidation(page, '#email');
  expect(validation.isValid).toBe(false);
});
```

## DevExtreme Selectors

Use the predefined selectors from `DevExtremeSelectors` for common component types:

```typescript
import { DevExtremeSelectors } from '../helpers';

const button = page.locator(DevExtremeSelectors.button);
const disabledButton = page.locator(
  `${DevExtremeSelectors.button}${DevExtremeSelectors.disabled}`
);
```

## Notes

- All helper functions include timeout handling (default: 5-30 seconds depending on operation)
- Shadow DOM is automatically handled where possible
- Functions wait for components to be fully initialized before interaction
- Async operations are properly awaited to prevent race conditions

## See Also

- [DevExtreme Angular Documentation](https://js.devexpress.com/Angular/Documentation/)
- [Playwright Documentation](https://playwright.dev/)

