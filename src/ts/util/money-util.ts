import * as _ from 'lodash';

export class MoneyUtil {
    /**
     * 金額格式 無條件捨去
     * @param value
     * @param n 小數位
     */
    public static floorFormat(value: any, n: number = 2): string {
        if (isNaN(value)) { return value; }
        return MoneyUtil.format(_.floor(value, isNaN(n) ? 2 : n).toFixed(n));
    }

    /**
     * 金額格式 四捨五入
     * @param value
     * @param n 小數位
     */
    public static roundFormat(value: any, n: number = 2): string {
        if (isNaN(value)) { return value; }
        return MoneyUtil.format(_.round(value, isNaN(n) ? 2 : n).toFixed(n));
    }

    /**
     * 金額格式
     * @param value
     * @param n
     */
    public static format(value: any) {
        if (isNaN(value)) { return value; }
        return String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
}
