# @playwright-devextreme/helpers

Playwright test helpers for DevExtreme Angular components with Shadow DOM support.

## Installation

```bash
npm install --save-dev @playwright-devextreme/helpers
```

### Local Development

If you're developing this package locally, you have a few options:

1. **Use npm link** (recommended):
   ```bash
   npm link
   # In your test project:
   npm link @playwright-devextreme/helpers
   ```

2. **Use relative imports in tests**:
   ```typescript
   import { ... } from '../../src';
   ```

3. **Build and install locally**:
   ```bash
   npm run build
   npm install ./dist
   ```

## Features

- ✅ Shadow DOM support for DevExtreme components
- ✅ Dynamic component rendering handling
- ✅ Component-specific helpers (Button, Input, DataGrid, Dropdown, etc.)
- ✅ TypeScript support with full type definitions
- ✅ Validation and state checking utilities
- ✅ Popup and modal handling

## Quick Start

```typescript
import { 
  clickDevExtremeButton,
  fillDevExtremeInput,
  waitForDevExtremeDataGridLoad 
} from '@playwright-devextreme/helpers';

test('My test', async ({ page }) => {
  await fillDevExtremeInput(page, '#my-input', 'Hello');
  await clickDevExtremeButton(page, '#my-button');
  await waitForDevExtremeDataGridLoad(page, '#my-grid');
});
```

## Documentation

### Core Utilities

#### `waitForDevExtremeComponent(page, selector, options?)`
Wait for a DevExtreme component to be fully initialized and rendered.

#### `findInShadowDOM(page, hostSelector, innerSelector)`
Find an element within a DevExtreme component's Shadow DOM.

#### `waitForDevExtremeAsyncOperation(page, componentSelector, options?)`
Wait for async operations (data loading, calculations) to complete.

### Component Helpers

#### Button
- `clickDevExtremeButton(page, buttonSelector, options?)`

#### Input/Editor
- `fillDevExtremeInput(page, inputSelector, value, options?)`
- `getDevExtremeValue(page, editorSelector, options?)`

#### Dropdown
- `selectDevExtremeDropdown(page, dropdownSelector, value, options?)`

#### DataGrid
- `waitForDevExtremeDataGridLoad(page, gridSelector, options?)`
- `getDevExtremeDataGridCellValue(page, gridSelector, rowIndex, columnIndex, options?)`
- `clickDevExtremeDataGridCell(page, gridSelector, rowIndex, columnIndex, options?)`

#### Popup/Modal
- `waitForDevExtremePopup(page, options?)`
- `closeDevExtremePopup(page, options?)`

#### Validation
- `waitForDevExtremeValidation(page, componentSelector, options?)`
- `getDevExtremeValidationMessages(page, validationGroupSelector?)`

#### State Checking
- `isDevExtremeComponentInState(page, componentSelector, state, options?)`

### Advanced Utilities

#### `executeDevExtremeComponentMethod(page, componentSelector, methodName, ...args)`
Execute a DevExtreme component method via Angular component instance.

## Examples

See the `tests/examples/` directory for comprehensive usage examples organized by component.

### Sample DevExtreme Angular App

A sample Angular application with DevExtreme components is included in the `sample-app/` directory. This app demonstrates all the components that the helpers support:

- **Button**: Interactive buttons with disabled state (`#my-button`)
- **Input/TextBox**: Text input fields (`#my-textbox`, `#name-input`, `#email-input`)
- **Dropdown/SelectBox**: Dropdown selection (`#my-dropdown`)
- **DataGrid**: Data table with multiple rows (`#my-datagrid`)
- **Popup**: Modal popup dialog (triggered by `#open-popup-button`)
- **Validation**: Form validation with validation groups

To run the sample app:
```bash
cd sample-app
npm install
npm start
```

The app will be available at `http://localhost:4200`

### Running Tests with Sample App

The Playwright configuration is set up to automatically start the sample app. To run tests:

1. Remove `.skip` from test functions in `tests/examples/*.spec.ts`
2. Run tests: `npm test`

The tests will automatically:
- Start the sample app server
- Navigate to the app
- Test all DevExtreme components using the helpers

- `button.spec.ts` - Button component examples
- `input.spec.ts` - Input/Editor component examples
- `dropdown.spec.ts` - Dropdown/SelectBox component examples
- `datagrid.spec.ts` - DataGrid component examples
- `popup.spec.ts` - Popup/Modal component examples
- `validation.spec.ts` - Validation component examples
- `state.spec.ts` - Component state checking examples
- `core.spec.ts` - Core utilities (Shadow DOM, async operations) examples
- `selectors.spec.ts` - Predefined selectors usage examples

## License

MIT

