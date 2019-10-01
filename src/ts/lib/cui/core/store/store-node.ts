import { CUI } from '../cui';
import { NotRecursionMethod } from '../decorators/not-recursion';
import { SessionStorageManager } from '../storage/session-storage-manager';

export interface IStoreNode<T> {
    listen(handler: IStoreListener, auto: boolean);
    interrupt(handler: IStoreListener);
    set(data: T);
    get(): T;
    isNonEmpty();
    isEmpty();
    clean();
    refreshTime();
    born();
    join(joinNode: IStoreNode<any>);
    addChild(childNode: IStoreNode<any>);
}

export interface IStoreListener {
    ();
}

export interface StoreNodeConfig<T> {
    /**
     * 資料ID
     */
    id: string;
    /**
     * 是否快取在localStorage
     */
    cache?: boolean;
    /**
     * 資料是否會超時無效
     */
    timeout?: boolean;
    /**
     * 相依的StoreNode，目前只用來更新localStorage時間
     */
    joinTo?: IStoreNode<any>[];
    /**
     * 上層節點
     */
    parent?: IStoreNode<any>;
    /**
     * 上層節點資料更新
     */
    onBorn?: Function;
    /** 預設值*/
    value?: T;
    /** 是否隔離操作相同資料物件，預設隔離*/
    safe?: boolean;
}

let storage = SessionStorageManager;

export class StoreNode<T> implements IStoreNode<T> {
    protected _data = undefined;
    private _dataString = undefined;
    private _handlers = [];
    private _childs = [];
    private _joins = [];

    /**
     * 資料配置
     * @param config
     */
    constructor(protected config: StoreNodeConfig<T>) {
        if (config.safe == undefined) {
            config.safe = true;
        }
        if (config.cache
            && !(config.timeout && storage.isTimeout(config.id))) {
            this._data = storage.get(config.id);
            this._dataString = storage.getNoParse(config.id);
        }
        if (config.joinTo) {
            for (let i in config.joinTo) {
                config.joinTo[i].join(this);
            }
        }
        if (config.parent) {
            config.parent.addChild(this);
        }
        if (this._data == undefined) {
            this.set(config.value);
        }
    }

    /**
     * return id
     */
    public getId() {
        return this.config.id;
    }

    /**
     * 監聽資料更新
     */
    public listen(handler: IStoreListener, auto?: boolean): IStoreListener {
        if (this._handlers.indexOf(handler) !== -1) {
            return;
        }
        if (auto && this.execute(handler)) {
            this._handlers.push(handler);
        } else {
            this._handlers.push(handler);
        }
        return handler;
    }

    /**
     * 中斷監聽
     */
    public interrupt(handler: IStoreListener) {
        // 移除並標記不執行
        this._handlers = this._handlers.filter((_handler) => {
            return _handler !== handler;
        });
    }

    /**
     * 更新資料
     */
    @NotRecursionMethod
    public set(data: T) {
        let newDataString;
        if (data === undefined || data === null) {
            newDataString = undefined;
        } else {
            newDataString = JSON.stringify(data);
        }
        if (this.config.safe) {
            if (newDataString === this._dataString) {
                return;
            }
            this._data = CUI.deepClone(data);
        } else {
            this._data = data;
        }
        this._dataString = newDataString;
        this.cache();
        this.notify();
    }

    /**
     * 觸發通知
     */
    public notify() {
        this.notifyChilds();
        this.notifys();
        this.notifyJoins();
    }

    /**
     *
     */
    public born() {
        if (this.config.onBorn instanceof Function) {
            this.config.onBorn();
        }
    }

    /**
     * 取得資料
     */
    public get(): T {
        if (this.config.safe) {
            return CUI.deepClone(this._data);
        } else {
            return this._data;
        }
    }

    /**
     * 是否非空值
     */
    public isNonEmpty(): boolean {
        return !CUI.isEmpty(this._data);
    }

    /**
     * 是否空值
     */
    public isEmpty(): boolean {
        return CUI.isEmpty(this._data);
    }

    /**
     * 清除資料
     */
    public clean() {
        this.set(undefined);
    }

    /**
     * 刷新時間
     */
    public refreshTime() {
        if (this.config.cache) {
            storage.refreshTime(this.config.id);
        }
    }

    /**
     * 建立相依性
     * @param joinNode
     */
    public join(joinNode: IStoreNode<any>) {
        if (this._joins.indexOf(joinNode)) {
            this._joins.push(joinNode);
        }
    }
    /**
     * 新增子節點
     * @param childNode
     */
    public addChild(childNode: IStoreNode<any>) {
        if (this._childs.indexOf(childNode)) {
            this._childs.push(childNode);
        }
    }

    /**
     * 暫存
     */
    private cache() {
        if (this.config.cache) {
            storage.setNoStringify(this.config.id, this._dataString);
        }
    }

    /**
     * 刷新所有同生共死的夥伴
     */
    private notifyChilds() {
        for (let i in this._childs) {
            this._childs[i].born();
        }
    }

    /**
     * 通知所有監聽的方法
     */
    private notifys() {
        for (let i in this._handlers) {
            this.execute(this._handlers[i]);
        }
    }

    /**
     * 刷新所有同生共死的夥伴
     */
    private notifyJoins() {
        if (this._data == undefined) {
            for (let i in this._joins) {
                this._joins[i].clean();
            }
        } else {
            for (let i in this._joins) {
                this._joins[i].refreshTime();
            }
        }
    }

    /**
     * 執行方法
     * @param handler
     */
    private execute(handler) {
        try {
            CUI.callFunction(handler, null);
        } catch (e) {
            console.error(e);
            return false;
        }
        return true;
    }
}
