import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent {
  public title!: string;
  public message!: string;
  public result: boolean = false;

  constructor(private readonly modalRef: BsModalRef) {}

  public no() {
    this.result = false;
    this.modalRef.hide();
  }

  public yes() {
    this.result = true;
    this.modalRef.hide();
  }
}
