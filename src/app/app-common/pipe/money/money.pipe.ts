import { Pipe, PipeTransform } from '@angular/core';
import { MoneyUtil } from 'ts/util/money-util';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(value: any, n?: number): any {
    return MoneyUtil.roundFormat(value, n);
  }
}
