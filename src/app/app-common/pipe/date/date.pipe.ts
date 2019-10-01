import { DateUtil } from 'ts/util/date-util';
import { Pipe, PipeTransform } from '@angular/core';
import { AppConfig } from 'ts/app-config';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: any, format?: string): any {
    if (format) {
      return DateUtil.format(value, format);
    } else {
      return DateUtil.format(value, AppConfig.YYYYMMDDHHmmss);
    }
  }
}
