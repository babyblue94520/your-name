

/**
 * Created by Clare on 2016/6/5.
 * @param {Object} conf {arguments:[],run:false,callback:false}
 *
 */
export class JsThread {
    private arguments;
    private run;
    private callback;
    private worker;

    constructor(private conf) {
        this.arguments = conf.arguments || [];
        this.run = conf.run || false;
        this.callback = conf.callback || false;
        this.worker = false;
    }

    // 執行
    public start() {
        if (!this.run) { return; }
        this.worker = this.createWorker();

    }
    // 停止
    public stop() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        if (this.callback) { this.callback({ status: 'stop', data: false }); }
    }
    // 回傳
    private onMessage(e) {
        this.worker = null;
        if (this.callback) { this.callback({ status: 'finish', data: e.data }); }
    }
    // 建立worker
    private createWorker() {
        if (!this.run) { return; }

        let script = document.createElement('script');
        script.type = 'javascript/worker';
        script.innerHTML = 'postMessage((' + this.run.toString() + ').apply(null,' + JSON.stringify(this.arguments) + '));';
        let blob = new Blob([script.textContent], { type: 'text/javascript' });
        let w = new Worker(window.URL.createObjectURL(blob));
        w.onmessage = this.onMessage;
        return w;
    }
}
