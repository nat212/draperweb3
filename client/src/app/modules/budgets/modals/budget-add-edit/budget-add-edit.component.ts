import { Component } from '@angular/core';
import { Budget } from '../../models/budget';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormModal } from '../../../../modals/form-modal/form-modal';

@Component({
  selector: 'app-budget-add-edit',
  templateUrl: './budget-add-edit.component.html',
  styleUrls: ['./budget-add-edit.component.scss'],
})
export class BudgetAddEditComponent extends FormModal<Budget> {
  public rangePickerConfig: Partial<BsDaterangepickerConfig> = {
    adaptivePosition: true,
    showClearButton: true,
    clearButtonLabel: 'Clear',
    dateInputFormat: 'Do MMM YYYY',
    rangeInputFormat: 'Do MMM YYYY',
  };

  constructor(modalRef: BsModalRef, formBuilder: FormBuilder) {
    super(formBuilder, modalRef);
  }

  public clearDate(): void {
    this.form.patchValue({ date: null });
  }

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      date: [null, Validators.required],
    });
  }

  protected getModelFromForm(): Budget {
    let startDate: string | null = null;
    let endDate: string | null = null;
    const { name, date } = this.form.value;
    if (date) {
      startDate = date[0].toISOString().split('T')[0];
      endDate = date[1].toISOString().split('T')[0];
    }
    return new Budget({
      url: this.originalModel?.url,
      id: this.originalModel?.id,
      name,
      start_date: startDate,
      end_date: endDate,
    });
  }

  protected patchForm(model: Budget): void {
    this.form.patchValue({
      name: model.name,
      date: model.startDate && model.endDate ? [model.startDate, model.endDate] : null,
    });
  }
}
