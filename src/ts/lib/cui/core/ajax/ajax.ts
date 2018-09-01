
import { AjaxMethod } from './ajax.enums';
import { IAjaxConfig, IAjaxNameValuePair } from './ajax.interfaces';
import { CUI } from '../cui';


/**
 * 不管ie6
 * upload不管ie10
 * 包裝後的ajax
 * by clare
 */
export class Ajax {
    /**
     * 發送
     */
    public static request(config: IAjaxConfig): XMLHttpRequest {
        try {
            let xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.timeout = config.timeout;
            if (config.callback) {
                xhr.addEventListener('load', Ajax.customHandler.bind(xhr, config.callback));
                xhr.addEventListener('error', Ajax.customHandler.bind(xhr, config.callback));
                xhr.addEventListener('abort', Ajax.customHandler.bind(xhr, config.callback));
                xhr.addEventListener('timeout', Ajax.customHandler.bind(xhr, config.callback));
            }
            if (config.progress) {
                xhr.upload.addEventListener('progress', Ajax.progressHandler.bind(xhr, config.progress));
                xhr.upload.addEventListener('load', Ajax.customHandler.bind(xhr, config.progress));
                xhr.upload.addEventListener('error', Ajax.customHandler.bind(xhr, config.progress));
                xhr.upload.addEventListener('abort', Ajax.customHandler.bind(xhr, config.progress));
            }
            let method = config.method.toUpperCase();
            if (AjaxMethod.GET == method) {
                let url = config.url;
                if (config.data != undefined) {
                    if (config.url.indexOf('?') == -1) {
                        if (config.isPHP) {
                            url += '?' + Ajax.parseSendDataPHP(config.data);
                        } else {
                            url += '?' + Ajax.parseSendData(config.data);
                        }
                    } else {
                        if (config.isPHP) {
                            url += '&' + Ajax.parseSendDataPHP(config.data);
                        } else {
                            url += '&' + Ajax.parseSendData(config.data);
                        }
                    }
                }
                xhr.open(config.method, url, config.async);
            } else {
                xhr.open(config.method, config.url, config.async);
            }
            let data;
            if (config.isPHP) {
                data = config.upload ? Ajax.toFormDataPHP(config.data) : Ajax.parseSendDataPHP(config.data);
            } else {
                data = config.upload ? Ajax.toFormData(config.data) : Ajax.parseSendData(config.data);
            }

            // 處理標頭
            if (config.headers) {
                let objs = config.headers.toObject();
                for (let name in objs) {
                    if (config.upload && 'CONTENT-TYPE' == String(name).toUpperCase()) {
                        continue;
                    }
                    xhr.setRequestHeader(name, objs[name]);
                }
            }
            if (AjaxMethod.GET == method) {
                xhr.send();
            } else {
                xhr.send(data);
            }
            return xhr;
        } catch (e) {
            throw new Error((<Error>e).message);
        }
    }


    /**
     * 進度回應
     */
    private static progressHandler(callback, e) {
        if (callback) {
            callback.call(this, this, e);
        }
    }

    /**
     * 結果回應
     */
    private static customHandler(callback, e) {
        if (callback) {
            callback.call(this, this, e);
        }
    }

    /**
     * 解析資料轉換為name=value&name=value....
     * 或者 神秘的資料格式
     */
    private static parseSendData(data: any): string {
        let sendString;
        if (CUI.isObject(data)) {
            let value, array = [];
            for (let name in data) {
                value = data[name];
                Ajax.parseValue(array, name, value);
            }
            sendString = array.join('&');
        } else if (CUI.isArray(data)) {
            let pair: IAjaxNameValuePair, array = [];
            for (let i in data) {
                pair = data[i];
                Ajax.parseValue(array, pair.name, pair.value);
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
    private static parseSendDataPHP(data: any): string {
        let sendString;
        if (CUI.isObject(data)) {
            let value, array = [];
            for (let name in data) {
                value = data[name];
                Ajax.parseValuePHP(array, name, value);
            }
            sendString = array.join('&');
        } else if (CUI.isArray(data)) {
            let pair: IAjaxNameValuePair, array = [];
            for (let i in data) {
                pair = data[i];
                Ajax.parseValuePHP(array, pair.name, pair.value);
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
    private static toFormDataPHP(data: any): FormData {
        let formData = new FormData();
        if (CUI.isObject(data)) {
            let value;
            for (let name in data) {
                value = data[name];
                Ajax.appendValuePHP(formData, name, value);
            }
        } else if (CUI.isArray(data)) {
            let pair: IAjaxNameValuePair;
            for (let i in data) {
                pair = data[i];
                Ajax.appendValuePHP(formData, pair.name, pair.value);
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
    private static toFormData(data: any): FormData {
        let formData = new FormData();
        if (CUI.isObject(data)) {
            let value;
            for (let name in data) {
                value = data[name];
                Ajax.appendValue(formData, name, value);
            }
        } else if (CUI.isArray(data)) {
            let pair: IAjaxNameValuePair;
            for (let i in data) {
                pair = data[i];
                Ajax.appendValue(formData, pair.name, pair.value);
            }
        } else {
            formData = data;
        }
        return formData;
    }

    private static parseValue(array: any[], name: string, value: any) {
        if (CUI.isArray(value)) {
            for (let j in value) {
                array.push(encodeURIComponent(name) + '=' + encodeURIComponent(value[j]));
            }
        } else {
            array.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
        }
    }

    private static parseValuePHP(array: any[], name: string, value: any) {
        let temp;
        if (CUI.isArray(value)) {
            for (let i in value) {
                temp = value[i];
                if (CUI.isArray(temp) || CUI.isObject(temp)) {
                    Ajax.parseValuePHP(array, name + '[' + i + ']', temp);
                } else {
                    Ajax.parseValuePHP(array, name + '[]', temp);
                }
            }
        } else if (CUI.isObject(value)) {
            for (let id in value) {
                Ajax.parseValuePHP(array, name + '[' + id + ']', value[id]);
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
                    Ajax.appendValuePHP(formData, name + '[' + i + ']', temp);
                } else {
                    Ajax.appendValuePHP(formData, name + '[]', temp);
                }
            }
        } else if (CUI.isObject(value)) {
            for (let id in value) {
                Ajax.appendValuePHP(formData, name + '[' + id + ']', value[id]);
            }
        } else {
            formData.append(name, value);
        }
    }
}
