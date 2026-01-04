# @nuanst-one/playwright-devextreme-angular

Playwright test helpers for DevExtreme Angular components with Shadow DOM support.

## Installation

```bash
npm install --save-dev @nuanst-one/playwright-devextreme-angular
```

### Requirements

- **Playwright**: `^1.40.0` or higher
- **DevExtreme**: `>=20.0.0` (tested with `^23.2.0`)
- **DevExtreme Angular**: `>=20.0.0` (tested with `^23.2.0`)

**Note**: While the helpers may work with DevExtreme 20.0.0+, they are officially tested and supported with DevExtreme 23.2.0 and above. The helpers rely on:
- Standard DevExtreme CSS classes (`.dx-*`, `.dx-state-*`)
- ARIA attributes (`role="gridcell"`, `role="columnheader"`, `aria-describedby`)
- Standard HTML structure patterns

If you're using an older version of DevExtreme, some features may not work as expected.

### Local Development

If you're developing this package locally, you have a few options:

1. **Use npm link** (recommended):
   ```bash
   npm link
   # In your test project:
   npm link @nuanst-one/playwright-devextreme-angular
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
} from '@nuanst-one/playwright-devextreme-angular';

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

A sample Angular application with DevExtreme components is included in the `examples/sample-app/` directory. This app demonstrates all the components that the helpers support:

- **Button**: Interactive buttons with disabled state (`#my-button`)
- **Input/TextBox**: Text input fields (`#my-textbox`, `#name-input`, `#email-input`)
- **Dropdown/SelectBox**: Dropdown selection (`#my-dropdown`)
- **DataGrid**: Data table with multiple rows (`#my-datagrid`)
- **Popup**: Modal popup dialog (triggered by `#open-popup-button`)
- **Validation**: Form validation with validation groups

To run the sample app:
```bash
cd examples/sample-app
npm install
npm start
```

The app will be available at `http://localhost:4200`

### Running Tests with Sample App

The sample app has its own Playwright configuration. To run tests:

**From the sample-app directory:**
```bash
cd examples/sample-app
npm install
npm run test:e2e
```

**From the project root:**
```bash
npm run test:sample
```

The tests will automatically:
- Start the sample app server
- Navigate to the app
- Test all DevExtreme components using the helpers

The sample app includes comprehensive test examples in `examples/sample-app/tests/examples/` that demonstrate usage of all helper functions.

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

