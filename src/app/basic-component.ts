
import { AppRoute as AppRouteOrigin } from 'ts/ng/router/app';
import { StoreNode, IStoreListener } from '@cui/core';
import { OnDestroy, AfterContentChecked, AfterViewChecked, DoCheck } from '@angular/core';
import { ApiClassName as ApiClassNameOrigin } from 'ts/constant/API';
import { Global as GlobalOrigin } from 'ts/globle';
import { TranslateGoSourceKey as TranslateGoSourceKeyOrigin } from 'ts/translate/TranslateGoSource';
import { BasicState as BasicStateOrigin } from 'ts/constant/basic-state';


interface Nodes {
    [key: string]: StoreNode<any>;
}
interface NodeHandlers {
    [key: string]: IStoreListener[];
}

export abstract class BasicComponent implements AfterViewChecked, OnDestroy {
    public TranslateGoSourceKey = TranslateGoSourceKeyOrigin;
    public BasicState = BasicStateOrigin;
    public Global = GlobalOrigin;
    public AppRoute = AppRouteOrigin;
    public ApiClassName = ApiClassNameOrigin;
    public nodes: Nodes = {};
    public nodeHandlers: NodeHandlers = {};
    public constructorName;
    constructor() {
        this.constructorName = this.constructor.name;
    }

    ngAfterViewChecked() {
        // console.log(this.constructorName + ' ngAfterViewChecked');
    }

    ngOnDestroy() {
        // console.log(this.constructorName + ' ngOnDestroy');
        this.interruptNode();
    }

    /**
     * 監聽StoreNode改變
     * @param node
     * @param handler
     * @param auto 第一次監聽立即執行
     */
    protected listenNode(node: StoreNode<any>, handler: IStoreListener, auto?: boolean) {
        node.listen(handler, auto);
        let id = node.getId();
        this.nodes[id] = node;

        let handlers = this.nodeHandlers[id];
        if (!handlers) {
            this.nodeHandlers[id] = handlers = [];
        }
        handlers.push(handler);
    }

    /**
     * 中斷StoreNode改變監聽
     */
    private interruptNode() {
        let node: StoreNode<any>;
        let handlers: IStoreListener[];
        for (let id in this.nodes) {
            node = this.nodes[id];
            handlers = this.nodeHandlers[id];
            for (let i in handlers) {
                node.interrupt(handlers[i]);
            }
        }
    }
}
