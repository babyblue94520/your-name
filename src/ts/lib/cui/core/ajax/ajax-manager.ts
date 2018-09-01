
import { Ajax } from './ajax';
import { AjaxHeaders } from './ajax.beans';
import { AjaxContentType, AjaxHeader, AjaxDataType, AjaxMethod, AjaxException } from './ajax.enums';
import { IAjaxConfig, IAjaxManagerResult, IAjaxManagerResultCallback, IAjaxCallback } from './ajax.interfaces';
import { CUI } from '../cui';

/**
 * 提交請求前處理介面
 */
export interface IBeforeRequestHandler {
    (config: IAjaxConfig);
}

/**
 * 添加回傳結果前處理介面
 */
export type IBeforeCallbackHandler = (result: IAjaxManagerResult, statusCode) => boolean;

interface AjaxManagerXHR extends XMLHttpRequest {
    requestConfig?: IAjaxConfig;
}

interface AjaxManageConfig extends IAjaxConfig {
    tempCallback?: IAjaxCallback | IAjaxManagerResultCallback;
}


/**
 * Ajax管理者
 * 統一處理回傳訊息格式
 * by clare
 */
export class AjaxManager {
    private static readonly httpStatusText = {
        400: '請求內容錯誤！',
        401: '用户驗證失敗！',
        402: '必須支付！',
        403: '禁止該請求！',
        404: '網頁不存在！',
        405: '方法不允許！',
        406: '不能接受的請求！',
        407: '必須代理認證！',
        408: '請求超時！',
        500: '伺服器發生錯誤！',
        501: '伺服器未實現！',
        502: '伺服器無回應！',
        503: '暫停服務！',
        504: '請求超時！'
    };

    private static readonly errorText = {
        abort: '請求中斷！',
        timeout: '用户驗證失敗！',
        error: '例外錯誤！',
    };

    // 儲存執行中的ajax
    private _executeAjaxs = {};
    // 提交請求前處理
    private _beforeRequestHandler: IBeforeRequestHandler[] = [];
    // 回傳結果前處理
    private _beforeCallbackHandler: IBeforeCallbackHandler[] = [];

    /**
     *
     * @param isPHP 是否為PHP
     */
    constructor(private isPHP: boolean = false) {
        // 註冊離開網頁事件
        // window.addEventListener('beforeunload', this.beforeunload);
    }

    /**
     * 添加提交請求前，先執行的方法
     */
    public addBeforeRequest = (handler: IBeforeRequestHandler) => {
        this._beforeRequestHandler.push(handler);
    }

    /**
     * 添加回傳結果前，先執行的方法
     */
    public addBeforeCallback = (handler: IBeforeCallbackHandler) => {
        this._beforeCallbackHandler.push(handler);
    }

    /**
     * 是否有正在運行的ajax
     */
    public hasRun = (url?: string): boolean => {
        if (url) {
            for (let key in this._executeAjaxs) {
                if (key == url) {
                    return true;
                }
            }
        } else {
            for (let key in this._executeAjaxs) {
                return true;
            }
        }
        return false;
    }

    /**
     * 如果有ajax在運行的话，就退出運行的ajax
     */
    public abort = () => {
        for (let url in this._executeAjaxs) {
            try {
                this._executeAjaxs[url].abort();
                delete this._executeAjaxs[url];
            } catch (e) {
                console.error(url + ' ajax abort', e);
            }
        }
    }

    /**
     * 發送請求
     */
    public request = (config: IAjaxConfig) => {
        // 相同請求，同時間只能一個
        if (config.method == AjaxMethod.POST && this.hasRun(config.url)) {
            alert('相同的POST請求執行中');
            return;
        }
        this.doBeforeRequest(config);
        let realConfig: AjaxManageConfig = CUI.deepClone({
            isPHP: this.isPHP,
            async: true,
            method: AjaxMethod.GET,
            dataType: AjaxDataType.JSON
        }, config);
        this.initHeader(realConfig);
        realConfig.tempCallback = realConfig.callback;
        realConfig.callback = this.resultHandler;

        let xhr: AjaxManagerXHR = Ajax.request(realConfig);
        xhr.requestConfig = realConfig;
        this._executeAjaxs[config.url] = xhr;
        return xhr;
    }

    /**
     * ajax 回傳結果處理
     */
    private resultHandler = (xhr: AjaxManagerXHR, e: ProgressEvent) => {
        let config: AjaxManageConfig = xhr.requestConfig;
        // 移除完成的請求
        delete this._executeAjaxs[config.url];
        let result: IAjaxManagerResult = {
            success: false,
        };
        if (e.type === 'load') {
            if (xhr.status >= 200 && xhr.status < 300) {
                switch (xhr.status) {
                    case 204:
                        result.success = true;
                        break;
                    default:
                        this.injectSuccessResult(config, result, xhr.response);
                }
            } else {
                this.injectFailResult(config, result, xhr, e);
            }
        } else {
            this.injectFailResult(config, result, xhr, e);
        }
        if (this.doBeforeCallback(result, xhr.status)) {
            CUI.callFunction(config.tempCallback, null, result);
        }
    }

    /**
     * 提交請求前，先執行的方法
     */
    private doBeforeRequest = (config: IAjaxConfig) => {
        for (let i in this._beforeRequestHandler) {
            CUI.callFunction(this._beforeRequestHandler[i], null, config);
        }
    }

    /**
     * 回傳結果前，先執行的方法
     */
    private doBeforeCallback = (result: IAjaxManagerResult, statusCode): boolean => {
        for (let i in this._beforeCallbackHandler) {
            if (!CUI.callFunction(this._beforeCallbackHandler[i], null, result, statusCode)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 初始化表頭
     */
    private initHeader(config: IAjaxConfig) {
        if (config.method && config.method.toUpperCase() === AjaxMethod.POST) {
            if (config.headers) {
                if (!config.headers.toObject()[AjaxHeader.ContentType]) {
                    config.headers.append(AjaxHeader.ContentType, AjaxContentType.FORM);
                }
            } else {
                config.headers = new AjaxHeaders(AjaxHeader.ContentType, AjaxContentType.FORM);
            }
        }
    }

    /**
     * 離開網頁時，檢查是否有正在運行的ajax
     */
    private beforeunload = (e: Event) => {
        if (this.hasRun()) {
            return '目前尚有正在執行的動作，可能會造成資料異常，確認要離開？';
        }
    }

    /**
     * 2XX~3XX的處理
     */
    private injectSuccessResult = (config: IAjaxConfig, result: IAjaxManagerResult, response: string) => {
        result.success = true;
        if (config.dataType === AjaxDataType.JSON) {
            this.parseJson(result, response);
        } else if (config.dataType === AjaxDataType.TEXT) {
            result.data = response;
        } else {
            result.data = response;
        }
    }

    /**
     * 非2XX~3XX的處理
     */
    private injectFailResult = (config: IAjaxConfig, result: IAjaxManagerResult, xhr: XMLHttpRequest, e) => {
        result.success = false;

        if (config.dataType === AjaxDataType.JSON) {
            this.parseJson(result, xhr.response);
        } else if (config.dataType === AjaxDataType.TEXT) {
            result.data = xhr.response;
        } else {
            result.data = xhr.response;
        }
        if (result.message == undefined || result.message == '') {
            result.message = (result.message != AjaxException.JSONPARSEERROR) && (this.getHttpStatusText(xhr.status) || this.getErrorText(e.type));
        }
    }

    /**
     * 取得請求失敗信息
     */
    private getHttpStatusText = (statusCode) => {
        return AjaxManager.httpStatusText[statusCode] || statusCode;
    }

    /**
     * 其他錯誤訊息
     */
    private getErrorText = (statusCode) => {
        return AjaxManager.errorText[statusCode] || statusCode;
    }

    /**
     * 將回傳資料轉成json
     * 另外嘗試轉成 取出message
     */
    private parseJson = (result: IAjaxManagerResult, response: string) => {
        try {
            let json = JSON.parse(response);
            if (CUI.isObject(json)) {
                CUI.deepClone(result, json);
            } else {
                result.data = json;
            }
        } catch (e) {
            result.success = false;
            result.message = response;
        }
    }
}
