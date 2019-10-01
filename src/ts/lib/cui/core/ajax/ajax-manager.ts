import { Ajax } from './ajax';
import {
    AjaxContentType,
    AjaxDataType,
    AjaxException,
    AjaxHeader,
    AjaxMethod
} from './ajax.enums';
import { AjaxHeaders } from './ajax.beans';
import { CUI } from '../cui';
import {
    IAjaxConfig,
    IAjaxManageConfig,
    IAjaxManagerResult,
    IAjaxManagerResultCallback,
    IAjaxQueue
} from './ajax.interfaces';


/**
 * 提交請求前處理介面
 */
export interface IBeforeRequestHandler {
    (config: IAjaxConfig);
}

/**
 * 添加回傳結果前處理介面
 */
export type IBeforeCallbackHandler = (result: IAjaxManagerResult, statusCode, config: IAjaxConfig) => boolean;


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
        503: '停止服務！',
        504: '請求超時！'
    };

    private static readonly errorText = {
        abort: '請求中斷！',
        timeout: '用户驗證失敗！',
        error: '例外錯誤！',
    };

    private _queues = {};
    private _queuesRunCount = {};
    private _executeQueues = {};

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
        return Ajax.hasRun(url);
    }

    /**
     * 如果有ajax在運行的话，就退出運行的ajax
     */
    public abort = () => {
        this._queues = {};
        this._queuesRunCount = {};
        Ajax.abort();
    }

    /**
     * 依scope id 中斷ajax
     * @param id
     */
    public abortQueue(id: string) {
        if (this._queues[id]) {
            this._queues[id].length = 0;
        }
        if (this._queuesRunCount[id]) {
            this._queuesRunCount[id] = 0;
        }
        let xhrs = this._executeQueues[id];
        if (xhrs && xhrs.length > 0) {
            let xhr;
            let array = CUI.deepClone(this._executeQueues[id]);
            for (let i in array) {
                xhr = array[i];
                try {
                    xhr.abort();
                } catch (e) {
                    console.error(xhr + ' ajax abort', e);
                }
            }
            this._executeQueues[id].length = 0;
        }
    }

    /**
     * 發送請求
     */
    public request = <T = any, V = any, K = any, Y = any>(config: IAjaxManageConfig<T, V, K, Y>): XMLHttpRequest => {
        // 相同請求，同時間只能一個
        if (config.method == AjaxMethod.POST && this.hasRun(config.url)) {
            config.callback({ success: false, message: '相同的POST請求執行中' });
            return;
        }
        if (config.queue) {
            // 排隊發送請求
            let queue = this._queues[config.queue.id];
            if (!queue) {
                queue = this._queues[config.queue.id] = [];
            }
            queue.push(config);
            return this.nextQueueRequest(config.queue);
        } else {
            return this.doRequest(config);
        }
    }


    /**
     * 發送請求
     */
    private doRequest = <T = any, V = any, K = any, Y = any>(config: IAjaxManageConfig<T, V, K, Y>): XMLHttpRequest => {
        let cloneConfig: IAjaxConfig = CUI.deepClone({
            isPHP: this.isPHP,
            async: true,
            method: AjaxMethod.GET,
            dataType: AjaxDataType.JSON,
            background: false
        }, config);
        this.initHeader(cloneConfig);
        this.doBeforeRequest(cloneConfig);
        cloneConfig.callback = this.resultHandler.bind(this, cloneConfig, cloneConfig.callback);
        return Ajax.request(cloneConfig);
    }

    /**
     * ajax 回傳結果處理
     */
    private resultHandler(config: IAjaxManageConfig, callback: IAjaxManagerResultCallback, xhr: XMLHttpRequest, e: ProgressEvent) {
        let result: IAjaxManagerResult = {
            success: false,
        };
        let response = xhr.response;
        if (response == undefined) {
            response = xhr.responseText;
        }
        if (e.type === 'load') {
            if (xhr.status >= 200 && xhr.status < 300) {
                switch (xhr.status) {
                    case 204:
                        result.success = true;
                        break;
                    default:
                        this.injectSuccessResult(config, result, response);
                }
            } else {
                this.injectFailResult(config, result, response, xhr, e);
            }
        } else {
            this.injectFailResult(config, result, response, xhr, e);
        }
        if (this.doBeforeCallback(result, xhr.status, config)) {
            CUI.callFunction(callback, null, result, e);
            this.queueCallback(xhr, config.queue);
        }
    }

    /**
     * 佇列請求callback
     * @param xhr
     * @param queueConfig
     */
    private queueCallback(xhr, queueConfig: IAjaxQueue) {
        if (!queueConfig) {
            return;
        }
        let id = queueConfig.id;
        this._queuesRunCount[id]--;
        let index = this._executeQueues[id].indexOf(xhr);
        if (index != -1) {
            this._executeQueues[id].splice(index, 1);
        }
        this.nextQueueRequest(queueConfig);
    }

    /**
     * 執行下一個佇列請求
     */
    private nextQueueRequest(queueConfig: IAjaxQueue): XMLHttpRequest {
        let id = queueConfig.id;
        let queue = this._queues[id];
        if (queue) {
            let count = this._queuesRunCount[id];
            if (isNaN(count) || count < 0) {
                count = this._queuesRunCount[id] = 0;
            }
            if (queue.length > 0 && count < queueConfig.concurrent) {
                this._queuesRunCount[id]++;
                if (!this._executeQueues[id]) {
                    this._executeQueues[id] = [];
                }
                return this._executeQueues[id].push(this.doRequest(queue.shift()));
            }
        }
    }

    /**
     * 提交請求前，先執行的方法
     */
    private doBeforeRequest(config: IAjaxConfig) {
        for (let i in this._beforeRequestHandler) {
            CUI.callFunction(this._beforeRequestHandler[i], null, config);
        }
    }

    /**
     * 回傳結果前，先執行的方法
     */
    private doBeforeCallback(result: IAjaxManagerResult, statusCode, config: IAjaxManageConfig): boolean {
        for (let i in this._beforeCallbackHandler) {
            if (!CUI.callFunction(this._beforeCallbackHandler[i], null, result, statusCode, config)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 初始化表頭
     */
    private initHeader(config: IAjaxConfig) {
        if (config.method && config.method.toUpperCase() !== AjaxMethod.GET) {
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
    private beforeunload(e: Event) {
        if (this.hasRun()) {
            return '目前尚有正在執行的動作，可能會造成資料異常，確認要離開？';
        }
    }

    /**
     * 2XX~3XX的處理
     */
    private injectSuccessResult(config: IAjaxManageConfig, result: IAjaxManagerResult, response: string) {
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
    private injectFailResult(config: IAjaxManageConfig, result: IAjaxManagerResult, response: string, xhr: XMLHttpRequest, e) {
        result.success = false;

        if (config.dataType === AjaxDataType.JSON) {
            this.parseJson(result, response);
        } else if (config.dataType === AjaxDataType.TEXT) {
            result.data = response;
        } else {
            result.data = response;
        }
        if (result.message == undefined || result.message == '') {
            result.message = (result.message != AjaxException.JSONPARSEERROR) && (this.getHttpStatusText(xhr.status) || this.getErrorText(e.type));
        }
    }

    /**
     * 取得請求失敗信息
     */
    private getHttpStatusText(statusCode) {
        return AjaxManager.httpStatusText[statusCode] || statusCode;
    }

    /**
     * 其他錯誤訊息
     */
    private getErrorText(statusCode) {
        return AjaxManager.errorText[statusCode] || statusCode;
    }

    /**
     * 將回傳資料轉成json
     * 另外嘗試轉成 取出message
     */
    private parseJson(result: IAjaxManagerResult, response: string) {
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
