import { IAjaxManagerResult, IAjaxConfig, IAjaxNameValuePair } from './ajax.interfaces';
import { AjaxHeaders } from './ajax.beans';
import { CUI } from '../cui';

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

    public static buildGetUrl(config: IAjaxConfig) {
        let url = config.url;
        if (config.data != undefined) {
            if (config.url.indexOf('?') == -1) {
                if (config.isPHP) {
                    url += '?' + AjaxUtil.parseSendDataPHP(config.data);
                } else {
                    url += '?' + AjaxUtil.parseSendData(config.data);
                }
            } else {
                if (config.isPHP) {
                    url += '&' + AjaxUtil.parseSendDataPHP(config.data);
                } else {
                    url += '&' + AjaxUtil.parseSendData(config.data);
                }
            }
        }
        return url;
    }

    /**
     * 解析資料轉換為name=value&name=value....
     * 或者 神秘的資料格式
     */
    public static parseSendData(data: any): string {
        let sendString;
        if (CUI.isObject(data)) {
            let value, array = [];
            for (let name in data) {
                value = data[name];
                AjaxUtil.parseValue(array, name, value);
            }
            sendString = array.join('&');
        } else if (CUI.isArray(data)) {
            let pair: IAjaxNameValuePair, array = [];
            for (let i in data) {
                pair = data[i];
                AjaxUtil.parseValue(array, pair.name, pair.value);
            }
            sendString = array.join('&');
        } else {
            sendString = data;
        }
        return sendString;
    }

    /**
     * PHP版
     * 解析資料轉換為name=value&name=value....
     * 或者 神秘的資料格式
     */
    public static parseSendDataPHP(data: any): string {
        let sendString;
        if (CUI.isObject(data)) {
            let value, array = [];
            for (let name in data) {
                value = data[name];
                AjaxUtil.parseValuePHP(array, name, value);
            }
            sendString = array.join('&');
        } else if (CUI.isArray(data)) {
            let pair: IAjaxNameValuePair, array = [];
            for (let i in data) {
                pair = data[i];
                AjaxUtil.parseValuePHP(array, pair.name, pair.value);
            }
            sendString = array.join('&');
        } else {
            sendString = data;
        }
        return sendString;
    }

    /**
     * 將資料轉成FormData
     */
    public static toFormDataPHP(data: any): FormData {
        let formData = new FormData();
        if (CUI.isObject(data)) {
            let value;
            for (let name in data) {
                value = data[name];
                AjaxUtil.appendValuePHP(formData, name, value);
            }
        } else if (CUI.isArray(data)) {
            let pair: IAjaxNameValuePair;
            for (let i in data) {
                pair = data[i];
                AjaxUtil.appendValuePHP(formData, pair.name, pair.value);
            }
        } else {
            formData = data;
        }
        return formData;
    }

    /**
     * PHP版
     * 將資料轉成FormData
     */
    public static toFormData(data: any): FormData {
        let formData = new FormData();
        if (CUI.isObject(data)) {
            let value;
            for (let name in data) {
                value = data[name];
                AjaxUtil.appendValue(formData, name, value);
            }
        } else if (CUI.isArray(data)) {
            let pair: IAjaxNameValuePair;
            for (let i in data) {
                pair = data[i];
                AjaxUtil.appendValue(formData, pair.name, pair.value);
            }
        } else {
            formData = data;
        }
        return formData;
    }

    public static parseValue(array: any[], name: string, value: any) {
        if (CUI.isArray(value)) {
            for (let j in value) {
                array.push(encodeURIComponent(name) + '=' + encodeURIComponent(value[j]));
            }
        } else {
            array.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
        }
    }

    public static parseValuePHP(array: any[], name: string, value: any) {
        let temp;
        if (CUI.isArray(value)) {
            for (let i in value) {
                temp = value[i];
                if (CUI.isArray(temp) || CUI.isObject(temp)) {
                    AjaxUtil.parseValuePHP(array, name + '[' + i + ']', temp);
                } else {
                    AjaxUtil.parseValuePHP(array, name + '[]', temp);
                }
            }
        } else if (CUI.isObject(value)) {
            for (let id in value) {
                AjaxUtil.parseValuePHP(array, name + '[' + id + ']', value[id]);
            }
        } else {
            array.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
        }
    }


    private static appendValue(formData: FormData, name: string, value: any) {
        if (CUI.isArray(value)) {
            for (let j in value) {
                formData.append(name, value[j]);
            }
        } else {
            formData.append(name, value);
        }
    }

    private static appendValuePHP(formData: FormData, name: string, value: any) {
        let temp;
        if (CUI.isArray(value)) {
            for (let i in value) {
                temp = value[i];
                if (CUI.isArray(temp) || CUI.isObject(temp)) {
                    AjaxUtil.appendValuePHP(formData, name + '[' + i + ']', temp);
                } else {
                    AjaxUtil.appendValuePHP(formData, name + '[]', temp);
                }
            }
        } else if (CUI.isObject(value)) {
            for (let id in value) {
                AjaxUtil.appendValuePHP(formData, name + '[' + id + ']', value[id]);
            }
        } else {
            formData.append(name, value);
        }
    }
}
