import { Component } from '@angular/core';
import { FormModal } from '../../../../modals/form-modal/form-modal';
import { Category } from '../../models/category';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IBsIcon, IconService } from '../../../../services/icon.service';

class Icon {
  icon: string;
  title: string;
  tags: string[];
  categories: string[];

  constructor(icon: string, bsIcon: IBsIcon[keyof IBsIcon]) {
    this.icon = icon;
    this.title = bsIcon.title;
    this.tags = [...(bsIcon.tags ?? [])];
    this.categories = [...(bsIcon.categories ?? [])];
  }

  public toString() {
    return this.icon;
  }
}

@Component({
  selector: 'app-category-add-edit',
  templateUrl: './category-add-edit.component.html',
  styleUrls: ['./category-add-edit.component.scss'],
})
export class CategoryAddEditComponent extends FormModal<Category> {
  icons: Icon[] = Object.keys(this.iconService.bsIcons)
    .filter((key) => key !== 'default')
    .map((key) => new Icon(`bi-${key}`, this.iconService.bsIcons[key]));

  constructor(formBuilder: FormBuilder, modalRef: BsModalRef, private readonly iconService: IconService) {
    super(formBuilder, modalRef);
  }

  private validIconValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    if (control.value instanceof Icon) {
      return null;
    } else {
      const exists = this.icons.find((icon) => icon.icon === control.value);
      return exists ? null : { invalidIcon: true };
    }
  }

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      icon: ['', Validators.compose([Validators.required, this.validIconValidator.bind(this)])],
    });
  }

  protected getModelFromForm(): Category {
    const icon: Icon | string = this.form.get('icon')!.value;
    return new Category({
      id: this.originalModel?.id,
      url: this.originalModel?.url,
      name: this.form.value.name,
      description: this.form.value.description,
      icon: icon instanceof Icon ? icon.icon : icon,
    });
  }

  protected patchForm(model: Category): void {
    this.form.patchValue({
      name: model.name,
      description: model.description,
      icon: model.icon,
    });
  }

  public isValidIcon(icon: string | Icon): boolean {
    if (icon instanceof Icon) {
      return true;
    }
    return this.icons.find((i) => i.icon === icon) !== undefined;
  }
}
