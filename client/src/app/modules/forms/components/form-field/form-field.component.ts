import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FormFieldComponent), multi: true }],
})
export class FormFieldComponent implements OnInit, ControlValueAccessor {
  private static currentId = 0;
  private onChange?: (value: any) => void;
  private onTouched?: () => void;
  private _value: any;
  private _id!: number;

  get id(): string {
    return `dw-form-field-${this._id}`;
  }

  get value(): any {
    return this._value;
  }

  @Input() label?: string;
  @Input() icon?: string;
  @Input() leadingText?: string;
  @Input() name?: string;
  @Input() type: HTMLInputElement['type'] = 'text';
  @Input() autocomplete?: HTMLInputElement['autocomplete'];
  @Input() datePicker = false;
  @Input() dateRangePicker = false;
  @Input() triggers = 'click';
  @Input() rangePickerConfig: Partial<BsDaterangepickerConfig> = {
    adaptivePosition: true,
    showClearButton: true,
    clearButtonLabel: 'Clear',
    dateInputFormat: 'Do MMM YYYY',
    rangeInputFormat: 'Do MMM YYYY',
  };

  ngOnInit(): void {
    this._value = null;
    this._id = FormFieldComponent.currentId++;
  }

  get mappedIcon(): string | undefined {
    return typeof this.icon === 'string' ? (this.icon?.startsWith('bi-') ? this.icon : `bi-${this.icon}`) : undefined;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  onInputBlur() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  onInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    const changed = this._value !== newValue;
    this._value = newValue;
    if (this.onChange && changed) {
      this.onChange(this.value);
    }
  }

  onDatePickerValueChanged(event?: Date | (Date | undefined)[]) {
    const changed = this._value !== event;
    if (this.onChange && changed) {
      this.onChange(event);
    }
  }
}
