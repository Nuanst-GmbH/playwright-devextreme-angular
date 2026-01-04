<div align="center">
  <img src="https://avatars.githubusercontent.com/u/102481288?s=200&v=4" alt="@nuanst-one/playwright-devextreme-angular" width="120" />
  
  # @nuanst-one/playwright-devextreme-angular
  
  **Playwright test helpers for DevExtreme Angular components with Shadow DOM support**
  
  [![npm version](https://img.shields.io/npm/v/@nuanst-one/playwright-devextreme-angular.svg)](https://www.npmjs.com/package/@nuanst-one/playwright-devextreme-angular)
  [![License](https://img.shields.io/npm/l/@nuanst-one/playwright-devextreme-angular.svg)](https://github.com/Nuanst-GmbH/playwright-devextreme-angular/blob/main/LICENSE)
</div>

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

## API Documentation

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

For comprehensive usage examples, see the [GitHub repository](https://github.com/Nuanst-GmbH/playwright-devextreme-angular/tree/main/examples/sample-app/tests/examples). The examples demonstrate:

- Button component interactions
- Input/Editor component usage
- Dropdown/SelectBox selection
- DataGrid operations
- Popup/Modal handling
- Validation workflows
- Component state checking
- Core utilities (Shadow DOM, async operations)

## Reporting Issues

If you find a bug or have a feature request, please open an issue on [GitHub](https://github.com/Nuanst-GmbH/playwright-devextreme-angular/issues) with:

- A clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Environment details (Node.js version, Playwright version, DevExtreme version, etc.)

## Contributing

If you'd like to contribute to this project, please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing guidelines, and contribution instructions.

## License

Apache-2.0
