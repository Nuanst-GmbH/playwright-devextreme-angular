# DevExtreme Angular Sample App

This is a sample Angular application with DevExtreme components for testing the Playwright helpers.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:4200`

## Components Included

- **Button**: Interactive buttons with disabled state
- **Input/TextBox**: Text input fields
- **Dropdown/SelectBox**: Dropdown selection component
- **DataGrid**: Data table with multiple rows and columns
- **Popup**: Modal popup dialog
- **Validation**: Form validation with validation groups

## Running Playwright Tests

This sample app includes Playwright tests in the `tests/` directory that demonstrate the usage of `@nuanst-one/playwright-devextreme-angular`.

### Run Tests

From the sample-app directory:
```bash
npm run test:e2e
```

Or from the project root:
```bash
npm run test:sample
```

### Test Commands

- `npm run test:e2e` - Run all tests
- `npm run test:e2e:ui` - Run tests with UI mode
- `npm run test:e2e:headed` - Run tests in headed mode (see browser)

### Component Selectors

The tests use these component selectors:
- `#my-button` - Main button
- `#my-textbox` - Text input
- `#my-dropdown` - Dropdown
- `#my-datagrid` - DataGrid
- `#open-popup-button` - Button to open popup
- `#name-input`, `#email-input` - Form inputs for validation

