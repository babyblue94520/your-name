import { DateUtil } from './date-util';
import { AppConfig } from '../app-config';
import { CUI } from '@cui/core';
import { MomeyUtil } from './momey-util';

export class GridRenderUtil {
    public static date(value, record: any, index): string {
        if (value) {
            return DateUtil.format(value, AppConfig.YYYYMMDDHHmmss);
        } else {
            return value;
        }
    }

    public static json(value, record: any, index): string {
        return CUI.printJson(value || '');
    }

    public static money(value, record: any, index): string {
        return MomeyUtil.format(value, 2);
    }

    public static moneyOrDefault(def, value, record: any, index): string {
        if (!value) {
            return def;
        }
        return MomeyUtil.format(value, 2);
    }

    public static valueName(map, value, record: any, index) {
        return map[value] || value;
    }

    public static notTranslate(value, record: any, index) {
        return '<span notTranslate>' + value + '</span>';
    }
}
