# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-04

### Added
- Initial release of Playwright test helpers for DevExtreme Angular components
- Shadow DOM support for DevExtreme components
- Component-specific helpers:
  - Button component interactions
  - Input/Editor component helpers
  - Dropdown/SelectBox selection
  - DataGrid operations (load, cell value, cell click)
  - Popup/Modal handling
  - Validation utilities
  - Component state checking
- Core utilities:
  - `waitForDevExtremeComponent` - Wait for component initialization
  - `findInShadowDOM` - Find elements within Shadow DOM
  - `waitForDevExtremeAsyncOperation` - Wait for async operations
- Advanced utilities:
  - `executeDevExtremeComponentMethod` - Execute component methods
- Full TypeScript support with type definitions
- Source maps for debugging
- Comprehensive documentation and examples

[Unreleased]: https://github.com/Nuanst-GmbH/playwright-devextreme-angular/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Nuanst-GmbH/playwright-devextreme-angular/releases/tag/v1.0.0

