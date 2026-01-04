/**
 * Copyright 2025 Nuanst-GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
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

