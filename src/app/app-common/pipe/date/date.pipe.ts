import { DateUtil } from 'ts/util/date-util';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: any, format: string): any {
    return DateUtil.format(value, format);
  }
}
