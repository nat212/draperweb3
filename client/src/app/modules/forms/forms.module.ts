import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";



@NgModule({
  declarations: [FormFieldComponent],
  exports: [FormFieldComponent],
  imports: [CommonModule, BsDatepickerModule],
})
export class AppFormsModule {}
