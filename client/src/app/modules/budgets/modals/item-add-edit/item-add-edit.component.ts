import { Component, ElementRef } from '@angular/core';
import { FormModal } from '../../../../modals/form-modal/form-modal';
import { BudgetItem } from '../../models/budget-item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-item-add-edit',
  templateUrl: './item-add-edit.component.html',
  styleUrls: ['./item-add-edit.component.scss'],
})
export class ItemAddEditComponent extends FormModal<BudgetItem> {
  constructor(formBuilder: FormBuilder, modalRef: BsModalRef) {
    super(formBuilder, modalRef);
  }

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      amount: [0, Validators.compose([Validators.required, Validators.min(0)])],
      mode: ['expense', Validators.required],
    });
  }

  protected getModelFromForm(): BudgetItem {
    const { name, amount, mode } = this.form.value;
    const newAmount = mode === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    return new BudgetItem({
      url: this.originalModel?.url,
      id: this.originalModel?.id,
      name: name,
      amount: newAmount,
    });
  }

  protected patchForm(model: BudgetItem): void {
    const mode = model.amount < 0 ? 'expense' : 'income';
    const amount = Math.abs(model.amount);
    this.form.patchValue({
      name: model.name,
      amount,
      mode,
    });
  }
}
