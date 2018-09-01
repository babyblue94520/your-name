
import { AppConfig } from 'ts/app-config';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DateUtil } from 'ts/util/date-util';

enum QuickDatePickerType {
  PrevMonth = 'prevMonth',
  PrevWeek = 'prevWeek',
  Yesterday = 'yesterday',
  Today = 'today',
  Week = 'week',
  Month = 'month',
}

@Component({
  selector: 'app-quick-date-picker',
  templateUrl: './quick-date-picker.component.html',
  styleUrls: ['./quick-date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickDatePickerComponent {
  private _startTime: HTMLInputElement;
  private _endTime: HTMLInputElement;
  public quickType = QuickDatePickerType;

  constructor() {

  }

  @Input() set startTime(element: HTMLInputElement) {
    this._startTime = element;
  }

  @Input() set endTime(element: HTMLInputElement) {
    this._endTime = element;
  }

  public click(type: QuickDatePickerType) {
    if (!type) {
      return;
    }
    let startTime = DateUtil.moment();
    let endTime = DateUtil.moment();

    switch (type) {
      case QuickDatePickerType.PrevMonth:
        startTime.date(1);
        startTime.subtract(1, 'month');
        endTime.date(0);
        break;
      case QuickDatePickerType.PrevWeek:
        startTime.weekday(-7);
        endTime.weekday(-1);
        break;
      case QuickDatePickerType.Yesterday:
        startTime.subtract(1, 'day');
        endTime.subtract(1, 'day');
        break;
      case QuickDatePickerType.Today:
        break;
      case QuickDatePickerType.Week:
        startTime.weekday(0);
        endTime.weekday(6);
        break;
      case QuickDatePickerType.Month:
        startTime.date(1);
        endTime.add(1, 'month');
        endTime.date(0);
        break;
      default:
    }
    if (this._startTime) {
      this._startTime.value = startTime.format(AppConfig.TodayStartYYYYMMDDHHmmss);
      this.dispatchEvent(this._startTime);
    }
    if (this._endTime) {
      this._endTime.value = endTime.format(AppConfig.TodayEndYYYYMMDDHHmmss);
      this.dispatchEvent(this._endTime);
    }
  }

  private dispatchEvent(element: HTMLElement) {
    let e = document.createEvent('HTMLEvents');
    e.initEvent('input', true, true);
    element.dispatchEvent(e);
  }
}
