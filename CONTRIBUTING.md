# Contributing to @nuanst-one/playwright-devextreme-angular

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm
- Git

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nuanst-GmbH/playwright-devextreme-angular.git
   cd playwright-devextreme-angular
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the package**:
   ```bash
   npm run build
   ```

### Local Development

If you're developing this package locally and want to test it in your own project, you have a few options:

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

## Project Structure

```
.
├── src/                    # Source TypeScript files
│   ├── components/         # Component-specific helpers
│   ├── core/              # Core utilities
│   ├── utils/             # Advanced utilities
│   ├── types.ts           # Type definitions
│   └── index.ts           # Main entry point
├── dist/                  # Compiled JavaScript (generated)
├── examples/              # Example applications and tests
│   └── sample-app/        # Sample Angular app with DevExtreme components
│       └── tests/         # Example test files
└── tests/                 # Test files (if any)
```

## Running Tests

### Sample App Tests

The project includes a sample Angular application with comprehensive test examples. To run the tests:

**From the project root:**
```bash
npm run test:sample
```

**From the sample-app directory:**
```bash
cd examples/sample-app
npm install
npm run test:e2e
```

**With UI mode:**
```bash
npm run test:ui
```

**With headed browser:**
```bash
npm run test:headed
```

The sample app includes comprehensive test examples in `examples/sample-app/tests/examples/` that demonstrate usage of all helper functions:

- `button.spec.ts` - Button component examples
- `input.spec.ts` - Input/Editor component examples
- `dropdown.spec.ts` - Dropdown/SelectBox examples
- `datagrid.spec.ts` - DataGrid component examples
- `popup.spec.ts` - Popup/Modal component examples
- `validation.spec.ts` - Validation component examples
- `state.spec.ts` - Component state checking examples
- `core.spec.ts` - Core utilities (Shadow DOM, async operations) examples
- `selectors.spec.ts` - Predefined selectors usage examples

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

## Development Workflow

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the `src/` directory

3. **Build and test**:
   ```bash
   npm run build
   npm run test:sample
   ```

4. **Commit your changes** with clear, descriptive commit messages

5. **Push and create a Pull Request**

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns and conventions
- Add JSDoc comments for public functions
- Ensure all tests pass before submitting

## Submitting Changes

1. Ensure your code builds successfully (`npm run build`)
2. Run tests to verify everything works (`npm run test:sample`)
3. Update documentation if needed
4. Create a Pull Request with a clear description of your changes

## Questions?

Feel free to open an issue for any questions or reach out to the maintainers.

