import { Component } from '@angular/core';

interface GridItem {
  id: number;
  name: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DevExtreme Angular Sample App';
  
  // Button state
  buttonDisabled = false;
  buttonText = 'Click Me';
  
  // Input values
  textInputValue = '';
  emailInputValue = '';
  nameInputValue = '';
  
  // Dropdown
  dropdownItems = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' },
    { id: 4, name: 'Option 4' }
  ];
  selectedDropdownValue = null;
  
  // DataGrid
  gridData: GridItem[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'Active' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', status: 'Active' }
  ];
  
  // Popup
  popupVisible = false;
  popupTitle = 'Sample Popup';
  
  // Validation
  validationGroup: any;
  
  constructor() {}
  
  onButtonClick() {
    this.buttonText = 'Clicked!';
    setTimeout(() => {
      this.buttonText = 'Click Me';
    }, 2000);
  }
  
  toggleButtonDisabled() {
    this.buttonDisabled = !this.buttonDisabled;
  }
  
  openPopup() {
    this.popupVisible = true;
  }
  
  closePopup() {
    this.popupVisible = false;
  }
  
  onSubmit() {
    if (this.validationGroup) {
      const result = this.validationGroup.instance.validate();
      if (result.isValid) {
        alert('Form is valid!');
      }
    }
  }
  
  onValidationGroupInit(e: any) {
    this.validationGroup = e.component;
  }
}

