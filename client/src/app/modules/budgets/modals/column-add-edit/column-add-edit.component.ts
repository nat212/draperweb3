import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BudgetColumn } from '../../models/budget-column';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormModal } from '../../../../modals/form-modal/form-modal';

@Component({
  selector: 'app-column-add-edit',
  templateUrl: './column-add-edit.component.html',
  styleUrls: ['./column-add-edit.component.scss'],
})
export class ColumnAddEditComponent extends FormModal<BudgetColumn> {
  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  protected patchForm(model: BudgetColumn): void {
    this.form.patchValue({ name: model.name });
  }

  protected getModelFromForm(): BudgetColumn {
    return new BudgetColumn({ name: this.form.value.name });
  }

  constructor(formBuilder: FormBuilder, modalRef: BsModalRef) {
    super(formBuilder, modalRef);
  }
}
