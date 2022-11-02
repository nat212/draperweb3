import { Component } from '@angular/core';
import { FormModal } from '../../../../modals/form-modal/form-modal';
import { BudgetItem } from '../../models/budget-item';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Category, ICategory } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-item-add-edit',
  templateUrl: './item-add-edit.component.html',
  styleUrls: ['./item-add-edit.component.scss'],
})
export class ItemAddEditComponent extends FormModal<BudgetItem> {
  constructor(formBuilder: UntypedFormBuilder, modalRef: BsModalRef, public readonly categoryService: CategoryService) {
    super(formBuilder, modalRef);
  }

  private static categoryValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    return control.value instanceof Category ? null : { invalidCategory: true };
  }

  protected buildForm(): UntypedFormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      amount: [null, Validators.compose([Validators.required, Validators.min(0)])],
      mode: ['expense', Validators.required],
      category: [null, ItemAddEditComponent.categoryValidator],
    });
  }

  protected getModelFromForm(): BudgetItem {
    const { name, amount, mode } = this.form.value;
    const category: Category | null = this.form.value.category;
    const newAmount = mode === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    return new BudgetItem({
      url: this.originalModel?.url,
      id: this.originalModel?.id,
      name: name,
      amount: newAmount,
      category: category?.serialise() as ICategory ?? undefined,
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
    if (model.category) {
      this.form.patchValue({ category: model.category });
    }
  }
}
