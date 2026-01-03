/**
 * DevExtreme Playwright Test Helpers
 * 
 * Export all helper functions and types for testing DevExtreme Angular components
 */

// Core utilities
export {
  waitForDevExtremeComponent,
  findInShadowDOM,
  waitForDevExtremeAsyncOperation,
} from './core/component';

// Component-specific helpers
export {
  clickDevExtremeButton,
} from './components/button';

export {
  fillDevExtremeInput,
  getDevExtremeValue,
} from './components/input';

export {
  selectDevExtremeDropdown,
} from './components/dropdown';

export {
  waitForDevExtremeDataGridLoad,
  getDevExtremeDataGridCellValue,
  clickDevExtremeDataGridCell,
} from './components/datagrid';

export {
  waitForDevExtremePopup,
  closeDevExtremePopup,
} from './components/popup';

export {
  waitForDevExtremeValidation,
  getDevExtremeValidationMessages,
} from './components/validation';

export {
  isDevExtremeComponentInState,
} from './components/state';

// Advanced utilities
export {
  executeDevExtremeComponentMethod,
} from './utils/advanced';

// Types and constants
export {
  DevExtremeSelectors,
} from './types';

export type {
  ComponentWaitOptions,
  ButtonOptions,
  InputOptions,
  DropdownOptions,
  DataGridOptions,
  PopupOptions,
  ValidationResult,
  ComponentState,
} from './types';

