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
 * Type definitions for DevExtreme component testing
 */

export interface ComponentWaitOptions {
  timeout?: number;
  state?: 'attached' | 'visible' | 'hidden';
}

export interface ButtonOptions {
  timeout?: number;
  force?: boolean;
}

export interface InputOptions {
  timeout?: number;
  clear?: boolean;
}

export interface DropdownOptions {
  timeout?: number;
  byText?: boolean;
}

export interface DataGridOptions {
  timeout?: number;
}

export interface PopupOptions {
  timeout?: number;
  title?: string;
  useCloseButton?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export type ComponentState = 'disabled' | 'readonly' | 'visible' | 'hidden';

/**
 * Common DevExtreme component selectors
 */
export const DevExtremeSelectors = {
  // Common component classes
  button: '.dx-button',
  textBox: '.dx-textbox',
  numberBox: '.dx-numberbox',
  dateBox: '.dx-datebox',
  selectBox: '.dx-selectbox',
  dropDownBox: '.dx-dropdownbox',
  checkBox: '.dx-checkbox',
  switch: '.dx-switch',
  radioGroup: '.dx-radiogroup',
  dataGrid: '.dx-datagrid',
  treeList: '.dx-treelist',
  treeView: '.dx-treeview',
  list: '.dx-list',
  popup: '.dx-popup',
  popover: '.dx-popover',
  tooltip: '.dx-tooltip',
  toast: '.dx-toast',
  accordion: '.dx-accordion',
  tabs: '.dx-tabs',
  form: '.dx-form',
  validationGroup: '.dx-validationgroup',
  
  // States
  disabled: '.dx-state-disabled',
  readonly: '.dx-state-readonly',
  focused: '.dx-state-focused',
  hovered: '.dx-state-hover',
  active: '.dx-state-active',
  selected: '.dx-state-selected',
  expanded: '.dx-state-expanded',
  collapsed: '.dx-state-collapsed',
  loading: '.dx-state-loading',
  invisible: '.dx-state-invisible',
  invalid: '.dx-invalid',
  
  // Loading indicators
  loadPanel: '.dx-loadpanel',
  loadIndicator: '.dx-loadindicator',
  
  // Popups and overlays
  popupWrapper: '.dx-popup-wrapper',
  overlayWrapper: '.dx-overlay-wrapper',
  popupContent: '.dx-popup-content',
  
  // Data grid specific
  dataGridRowsView: '.dx-datagrid-rowsview',
  dataGridRow: '.dx-datagrid-row',
  dataGridCell: '.dx-datagrid-cell',
  dataGridCommandCell: '.dx-command-cell',
  dataGridHeaderRow: '.dx-datagrid-headers',
  dataGridPager: '.dx-datagrid-pager',
  
  // List items
  listItem: '.dx-list-item',
  treeViewItem: '.dx-treeview-item',
  
  // Validation
  invalidMessage: '.dx-invalid-message',
  validationSummary: '.dx-validationsummary',
} as const;

