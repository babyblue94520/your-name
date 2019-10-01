
import { AppRoute as AppRouteOrigin } from 'ts/ng/router/app';
import { StoreNode, IStoreListener } from '@cui/core';
import { OnDestroy } from '@angular/core';
import { Global as GlobalOrigin } from 'ts/globle';
import { BasicState as BasicStateOrigin } from 'ts/constant/basic-state';


interface Nodes {
    [key: string]: StoreNode<any>;
}
interface NodeHandlers {
    [key: string]: IStoreListener[];
}

export abstract class BasicComponent implements OnDestroy {
    public BasicState = BasicStateOrigin;
    public Global = GlobalOrigin;
    public AppRoute = AppRouteOrigin;
    public nodes: Nodes = {};
    public nodeHandlers: NodeHandlers = {};
    public constructorName;
    constructor() {
        this.constructorName = this.constructor.name;
    }

    ngOnDestroy() {
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
