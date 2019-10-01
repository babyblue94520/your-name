import { AppConfig } from 'ts/app-config';
import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { Global } from 'ts/globle';
import { PickerType } from '@cui/core';

/**
 * 日期選擇器
 */
@Directive({
  selector: '[appDatePicker]'
})
export class DatePickerDirective implements OnDestroy {
  private element: HTMLElement;
  private input: HTMLInputElement;
  private _format = AppConfig.YYYYMMDDHHmmss;
  private _pickerType = PickerType.YMDHms;

  constructor(el: ElementRef) {
    this.element = el.nativeElement;
    let icon = document.createElement('div');
    icon.className = 'cui-datepicker-icon flaticon-date';
    icon.addEventListener('click', this.click);
    this.element.classList.add('cui-datepicker-select');
    this.element.appendChild(icon);
  }

  /**
   * 輸出資料格式
   */
  @Input() set format(value: string) {
    this._format = value;
  }

  /**
   * UI 樣式
   */
  @Input() set pickerType(value: PickerType) {
    this._pickerType = value;
  }

  private click = (e) => {
    if (!this.input) {
      this.input = this.element.querySelector('input');
    }
    Global.datePicker.open(this.input, this._format, this._pickerType);
  }

  ngOnDestroy() {
    Global.datePicker.close();
    this.element = undefined;
    this.input = undefined;
    this._format = undefined;
    this._pickerType = undefined;
  }
}
