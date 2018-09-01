import { IAjaxManagerResult } from './ajax.interfaces';
import { AjaxHeaders } from './ajax.beans';

export class AjaxUtil {
    public static readonly ContentTypeJson = new AjaxHeaders('Content-Type', 'application/json; charset=utf-8');



    public static getMessage(result: IAjaxManagerResult): string {
        if (result.success) {
            return '';
        }
        let array = [];
        if (result.errors) {
            for (let key in result.errors) {
                array.push(key + ' ' + result.errors[key]);
            }
            return array.join('\n');
        } else {
            return result.message;
        }
    }
}
