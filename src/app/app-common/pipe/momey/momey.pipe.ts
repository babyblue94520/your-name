import { Pipe, PipeTransform } from '@angular/core';
import { MomeyUtil } from 'ts/util/momey-util';

@Pipe({
  name: 'momey'
})
export class MomeyPipe implements PipeTransform {

  transform(value: any, n?: number): any {
    return MomeyUtil.format(value, n);
  }

}
