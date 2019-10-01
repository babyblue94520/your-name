
import { AjaxMethod } from './ajax.enums';
import { IAjaxConfig } from './ajax.interfaces';
import { CUI } from '../cui';
import { AjaxUtil } from './ajax-util';


interface AjaxXMLHttpRequest extends XMLHttpRequest {
    _request_url?: string;
}

/**
 * 不管ie6
 * upload不管ie10
 * 包裝後的ajax
 * by clare
 */
export class Ajax {
    // 儲存執行中的ajax
    private static _executeAjaxs: AjaxXMLHttpRequest[] = [];

    /**
     * 發送
     */
    public static request(config: IAjaxConfig): XMLHttpRequest {
        try {
            let xhr: AjaxXMLHttpRequest = new XMLHttpRequest();
            if (config.callback) {
                xhr.addEventListener('load', Ajax.customHandler.bind(xhr, config.callback));
                xhr.addEventListener('error', Ajax.customHandler.bind(xhr, config.callback));
                xhr.addEventListener('abort', Ajax.customHandler.bind(xhr, config.callback));
                xhr.addEventListener('timeout', Ajax.customHandler.bind(xhr, config.callback));
            }
            if (config.progress) {
                xhr.upload.addEventListener('progress', Ajax.customHandler.bind(xhr, config.progress));
                xhr.upload.addEventListener('load', Ajax.customHandler.bind(xhr, config.progress));
                xhr.upload.addEventListener('error', Ajax.customHandler.bind(xhr, config.progress));
                xhr.upload.addEventListener('abort', Ajax.customHandler.bind(xhr, config.progress));
            }
            let url = config.url;
            let method = config.method.toUpperCase();
            if (AjaxMethod.GET == method) {
                url = AjaxUtil.buildGetUrl(config);
            }
            xhr._request_url = url;
            xhr.open(config.method, url, config.async);
            if (config.timeout) {
                xhr.timeout = config.timeout;
            }
            let data;
            if (config.isPHP) {
                data = config.upload ? AjaxUtil.toFormDataPHP(config.data) : AjaxUtil.parseSendDataPHP(config.data);
            } else {
                data = config.upload ? AjaxUtil.toFormData(config.data) : AjaxUtil.parseSendData(config.data);
            }

            // 處理表頭
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
            Ajax._executeAjaxs.push(xhr);
            return xhr;
        } catch (e) {
            throw new Error((<Error>e).message);
        }
    }


    /**
     * 是否有正在運行的ajax
     */
    public static hasRun = (url?: string): boolean => {
        if (url) {
            for (let i in Ajax._executeAjaxs) {
                if (Ajax._executeAjaxs[i]._request_url == url) {
                    return true;
                }
            }
            return false;
        } else {
            return Ajax._executeAjaxs.length > 0;
        }
    }

    /**
     * 如果有ajax在運行的话，就退出運行的ajax
     */
    public static abort = () => {
        let xhr;
        let array = CUI.deepClone(Ajax._executeAjaxs);
        for (let i in array) {
            xhr = array[i];
            try {
                xhr.abort();
            } catch (e) {
                console.error(xhr + ' ajax abort', e);
            }
        }
        Ajax._executeAjaxs.length = 0;
    }

    /**
     * 結果回應
     */
    private static customHandler(callback, e) {
        let xhr: XMLHttpRequest = (<any>this);
        let index = Ajax._executeAjaxs.indexOf(xhr);
        if (index != -1) {
            Ajax._executeAjaxs.splice(index, 1);
        }
        if (callback instanceof Function) {
            callback.call(xhr, xhr, e);
        }
        xhr = undefined;
    }
}
