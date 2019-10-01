import * as moment from 'moment';

(<any>window).moment = moment;
export class DateUtil {


    public static moment(date?: any): moment.Moment {
        if (date) {
            return moment(date);
        } else {
            return moment();
        }
    }

    /**
     * 現在時間
     */
    public static now(format?: string): number | string {
        if (format) {
            return moment().format(format);
        } else {
            return Number(moment());
        }
    }

    public static format(time: number, format: string): string {
        if (time) {
            return moment(Number(time)).format(format);
        } else {
            return;
        }
    }

    public static time(date: string): number {
        if (date) {
            return Number(moment(date));
        } else {
            return;
        }
    }
}
