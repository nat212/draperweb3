import { Component, OnInit } from '@angular/core';
import { Budget } from '../../models/budget';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-budget-add-edit',
  templateUrl: './budget-add-edit.component.html',
  styleUrls: ['./budget-add-edit.component.scss'],
})
export class BudgetAddEditComponent implements OnInit {
  private originalBudget?: Budget;
  public budget?: Budget;
  public budgetForm!: FormGroup;
  public rangePickerConfig: Partial<BsDaterangepickerConfig> = {
    adaptivePosition: true,
    showClearButton: true,
    clearButtonLabel: 'Clear',
    dateInputFormat: 'Do MMM YYYY',
    rangeInputFormat: 'Do MMM YYYY',
  };
  public changed = false;

  constructor(
    private readonly bsModalRef: BsModalRef,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.originalBudget = this.budget;
    this.budgetForm = this.formBuilder.group({
      name: [this.budget?.name || '', Validators.required],
      date: [
        this.budget && this.budget.startDate && this.budget.endDate
          ? [this.budget.startDate, this.budget.endDate]
          : null,
      ],
    });
  }

  public clearDate(): void {
    this.budgetForm.patchValue({ date: null });
  }

  public close() {
    this.budget = undefined;
    this.bsModalRef.hide();
  }

  public save() {
    let startDate: string | null = null;
    let endDate: string | null = null;
    const { name, date } = this.budgetForm.value;
    if (date) {
      startDate = date[0].toISOString().split('T')[0];
      endDate = date[1].toISOString().split('T')[0];
    }
    this.budget = new Budget({
      url: this.originalBudget?.url,
      id: this.originalBudget?.id,
      name,
      start_date: startDate,
      end_date: endDate,
    });
    this.changed = true;
    this.bsModalRef.hide();
  }
}
