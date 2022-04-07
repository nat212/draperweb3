import { Directive, OnInit } from '@angular/core';
import { Model } from '../../models/model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Directive()
export abstract class FormModal<T extends Model<O>, O = any> implements OnInit {
  public form!: FormGroup;
  public changed = false;
  public originalModel?: T;
  public model?: T;
  public deleted = false;

  protected constructor(protected readonly formBuilder: FormBuilder, protected readonly modalRef: BsModalRef) {}

  protected abstract buildForm(): FormGroup;

  protected abstract patchForm(model: T): void;

  protected abstract getModelFromForm(): T;

  ngOnInit(): void {
    this.form = this.buildForm();
    this.originalModel = this.model;
    if (this.model) {
      this.patchForm(this.model);
    }
  }

  public close(): void {
    this.changed = false;
    this.modalRef.hide();
  }

  public save(): void {
    this.changed = true;
    this.model = this.getModelFromForm();
    this.modalRef.hide();
  }

  public delete(): void {
    this.changed = true;
    this.deleted = true;
    this.modalRef.hide();
  }
}
