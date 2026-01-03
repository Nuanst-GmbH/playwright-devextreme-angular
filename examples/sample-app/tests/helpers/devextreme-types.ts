/**
 * Type definitions for DevExtreme component testing
 */

export interface DevExtremeComponentOptions {
  timeout?: number;
  state?: 'attached' | 'visible' | 'hidden';
}

export interface DevExtremeButtonOptions {
  timeout?: number;
  force?: boolean;
}

export interface DevExtremeInputOptions {
  timeout?: number;
  clear?: boolean;
}

export interface DevExtremeDropdownOptions {
  timeout?: number;
  byText?: boolean;
}

export interface DevExtremeDataGridOptions {
  timeout?: number;
}

export interface DevExtremeAsyncOperationOptions {
  timeout?: number;
  checkInterval?: number;
}

export interface DevExtremePopupOptions {
  timeout?: number;
  title?: string;
  useCloseButton?: boolean;
}

export interface DevExtremeValidationResult {
  isValid: boolean;
  message?: string;
}

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

