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

## Usage with Playwright Tests

Update your Playwright tests to navigate to this app:

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});
```

Then use the component selectors:
- `#my-button` - Main button
- `#my-textbox` - Text input
- `#my-dropdown` - Dropdown
- `#my-datagrid` - DataGrid
- `#open-popup-button` - Button to open popup
- `#name-input`, `#email-input` - Form inputs for validation

