
interface DefaultConfig {
    text: string;
    className?: string;
}

interface ButtonConfig extends DefaultConfig {
    onclick: any;
}

interface PasteCallback {
    (text: string)
}

export abstract class DomUtil {
    /**
     * 產生按鈕
     * @param config
     * @param level 檢查或不檢查角色等級
     */
    public static buildButton(config: ButtonConfig, level?: number, user?: number): HTMLButtonElement {
        let button = DomUtil.create('button');
        button.className = 'cui-button ' + config.className || '';
        button.addEventListener('click', config.onclick);
        button.innerText = config.text;
        return button as HTMLButtonElement;
    }

    public static buildLinkButton(config: ButtonConfig): HTMLSpanElement {
        let span = DomUtil.create('span');
        span.className = 'cui-link-button ' + config.className || '';
        span.addEventListener('click', config.onclick);
        span.innerText = config.text;
        return span as HTMLSpanElement;
    }

    public static buildSpan(config: DefaultConfig): HTMLSpanElement {
        let span = DomUtil.create('span');
        span.className = config.className || '';
        span.innerText = config.text;
        return span as HTMLSpanElement;
    }

    public static buildDiv(config: DefaultConfig): HTMLDivElement {
        let div = DomUtil.create('div');
        div.className = config.className || '';
        div.innerText = config.text;
        return div as HTMLDivElement;
    }
    public static create(tagName: string): HTMLElement {
        return document.createElement(tagName);
    }

    public static copyText(text: string) {
        if (text) {
            var callback = (e) => {
                e.clipboardData.setData('text/plain', text);
                e.preventDefault();
            };
            document.addEventListener('copy', callback);
            document.execCommand('copy');
            document.removeEventListener('copy', callback);
        }
    }

    /**
     * 監聽貼上事件
     */
    public static addPasteListener(callback: PasteCallback): Function {
        var getText = (e: ClipboardEvent) => {
            let element = document.activeElement as HTMLInputElement;
            if ((element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') && !element.readOnly && !element.disabled) {
                return;
            }
            var clipboardData, pastedData;
            e.stopPropagation();
            e.preventDefault();
            clipboardData = e.clipboardData;
            pastedData = clipboardData.getData('Text');
            callback(pastedData);
        };
        document.addEventListener('paste', getText);
        return getText;
    }

    /**
     * 移除貼上監聽事件
     * @param fn 
     */
    public static removePasteListener(fn: any) {
        document.removeEventListener('paste', fn);
    }
}
