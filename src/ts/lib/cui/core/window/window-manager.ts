import { CUI } from '../cui';
import { WindowData, WindowConfig } from './window.interfaces';

/**
 * 開新視窗管理者
 */
export class WindowManager {
    private static _windows = {};
    private static tempOutHandler;

    /**
     * add unload remove all window event
     */
    public static addUnloadCloseAll() {
        this.tempOutHandler = this.outHandler.bind(this);
        window.addEventListener('beforeunload', this.tempOutHandler);
    }

    /**
     * remove unload remove all window event
     */
    public static removeUnloadCloseAll() {
        window.removeEventListener('beforeunload', this.tempOutHandler);
        this.tempOutHandler = undefined;
    }

    /**
     * do close all window
     * @param e
     */
    private static outHandler(e: Event) {
        this.closeAll();
        this.removeUnloadCloseAll();
    }

    /**
     * 是否有開啟新視窗
     */
    public static hasOpen(): boolean {
        let win: Window;
        for (let i in this._windows) {
            win = this._windows[i];
            if (win && !win.closed) {
                return true;
            }
        }
        this._windows = {};
        return false;
    }

    /**
     * 切換到目標新視窗
     * @param data
     */
    public static focus(data: WindowData): boolean {
        if (!this.checkData(data)) { return false; }
        return this.doFocus(data.id);
    }

    /**
     * 開啟新視窗 or id存在就切換過去
     * @param data
     * @param config
     */
    public static open(data: WindowData, config?: WindowConfig) {
        if (!this.checkData(data)) { return; }
        if (!this.doFocus(data)) {
            this.createWindow(data, config);
        }
    }

    /**
     * 關閉目標新視窗
     * @param data
     */
    public static close(data: WindowData) {
        if (this.checkData(data)) { return; }
        this.doClose(data.id);
    }

    /**
     * 關閉所有新視窗
     */
    public static closeAll() {
        for (let id in this._windows) {
            this.doClose(id);
        }
    }

    /**
     * 依id關閉視窗
     * @param id
     */
    public static doClose(id) {
        let win = this._windows[id];
        if (win) {
            win.close();
            delete this._windows[id];
        }
    }

    /**
     * 依id切換視窗
     * @param id
     */
    private static doFocus(id): boolean {
        let win = this._windows[id];
        if (win && !win.closed) {
            win.focus();
            return true;
        }
        return false;
    }

    /**
     * 建立新視窗
     * @param data
     * @param config
     */
    private static createWindow(data: WindowData, config?: WindowConfig) {
        let configString = [];
        if (config) {
            for (let i in config) {
                configString.push(i + '=' + config[i]);
            }
            // 有設定視窗大小的視窗，無法重新設定大小，必須先關閉
            this.doClose(data.id);
            this._windows[data.id] = window.open(data.url, data.id, configString.join(','), false);
        } else {
            this._windows[data.id] = window.open(data.url, data.id, null, false);
        }
    }

    /**
     * 檢查資料
     * @param data
     */
    private static checkData(data: WindowData): boolean {
        if (CUI.isEmpty(data.url)) {
            alert('url is empty！');
            return false;
        }
        if (CUI.isEmpty(data.id)) {
            alert('id is empty！');
            return false;
        }
        return true;
    }
}
