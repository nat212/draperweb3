import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {BudgetColumn} from '../../models/budget-column';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-column-add-edit',
  templateUrl: './column-add-edit.component.html',
  styleUrls: ['./column-add-edit.component.scss'],
})
export class ColumnAddEditComponent implements OnInit {
  public column?: BudgetColumn;
  public nameControl!: FormControl;
  public changed = false;

  constructor(private readonly bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.nameControl = new FormControl(
      this.column?.name || '',
      Validators.required
    );
  }

  public close(): void {
    this.changed = false;
    this.bsModalRef.hide();
  }

  public save(): void {
    this.changed = true;
    this.column = new BudgetColumn({
      id: this.column?.id,
      url: this.column?.url,
      name: this.nameControl.value!,
    });
    this.bsModalRef.hide();
  }
}
