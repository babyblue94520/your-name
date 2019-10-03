import { AjaxUtil, CUI } from '@cui/core';
import { AppConfig } from '../app-config';
import { DateUtil } from './date-util';
import { DomUtil } from './dom-util';
import { MoneyUtil } from './money-util';
import { Global } from 'ts/globle';

export abstract class GridRenderUtil {

    public static blank(value, record: any, index) {
        return value == undefined ? '' : value;
    }

    public static day(value, record: any, index): string {
        if (value && value > 0) {
            return DateUtil.format(value, AppConfig.YYYYMMDD);
        } else {
            return '';
        }
    }

    public static date(value, record: any, index): string {
        if (value && value > 0) {
            return DateUtil.format(value, AppConfig.YYYYMMDDHHmmss);
        } else {
            return '';
        }
    }

    public static reloadCallback(result) {
        if (result.success) {
            (<any>this).grid.reload();
        } else {
            alert(AjaxUtil.getMessage(result));
        }
    }

    public static json(value: any, record: any, index: number): HTMLElement[] {
        let copy = DomUtil.buildButton({
            text: 'copy',
            className: 'small',
            onclick: DomUtil.copyText.bind(this, value)
        });
        let span: HTMLSpanElement = document.createElement('span');
        span.setAttribute('notTranslate', '');
        try {
            let jsonElement = CUI.printJson(value || '');
            if (value == jsonElement) {
                span.innerText = jsonElement;
            } else {
                span.innerHTML = jsonElement;
            }
        } catch (e) {
            span.innerText = value;
        }
        return [copy, document.createElement('br'), span];
    }

    public static keyJson(value: any, record: any, index: number): HTMLElement[] {
        let copyValue = value;
        let key: string = record['key'];
        if (key && key.indexOf('request') != -1) {
            let headers = '';
            if (copyValue.headers) {
                for (let name in copyValue.headers) {
                    headers += name + ':' + copyValue.headers[name] + '\n';
                }
            }
            let params = '';
            if (copyValue.params && copyValue.params.length > 0) {

                for (let i in copyValue.params) {
                    params += copyValue.params[i].name + ':' + copyValue.params[i].value + '\n';
                }
            }
            copyValue = JSON.stringify({
                url: copyValue.url
                , method: copyValue.method.toLocaleLowerCase()
                , headers: headers
                , params: params
                , body: copyValue.bodyString
            })
        }
        let copy = DomUtil.buildButton({
            text: 'copy',
            className: 'small',
            onclick: DomUtil.copyText.bind(this, copyValue)
        });
        let span: HTMLSpanElement = document.createElement('span');
        span.setAttribute('notTranslate', '');
        try {
            let jsonElement = CUI.printJson(value || '');
            if (value == jsonElement) {
                span.innerText = jsonElement;
            } else {
                span.innerHTML = jsonElement;
            }
        } catch (e) {
            span.innerText = value;
        }
        return [copy, document.createElement('br'), span];
    }

    public static viewerJson(value: any, record: any, index: number): HTMLElement[] {
        if (value) {
            let copy = DomUtil.buildButton({
                text: 'copy',
                className: 'small',
                onclick: DomUtil.copyText.bind(this, value)
            });
            let viewer = DomUtil.buildButton({
                text: 'HTML檢視',
                className: 'small',
                onclick: openHtmlViewer.bind(this, value)
            });
            let span: HTMLSpanElement = document.createElement('span');
            span.setAttribute('notTranslate', '');
            try {
                let jsonElement = CUI.printJson(value || '');
                if (value == jsonElement) {
                    span.innerText = jsonElement;
                } else {
                    span.innerHTML = jsonElement;
                }
            } catch (e) {
                span.innerText = value;
            }
            return [viewer, copy, document.createElement('br'), span];
        } else {
            return null;
        }
    }

    public static money(value, record: any, index): string {
        return MoneyUtil.roundFormat(value, 2);
    }

    public static moneyOrDefault(def, value, record: any, index): string {
        if (!value) {
            return def;
        }
        return MoneyUtil.roundFormat(value, 2);
    }

    public static valueName(map, value, record: any, index) {
        return map[value] || value;
    }

    public static viewer(value, record: any, index): HTMLButtonElement {
        return DomUtil.buildButton({
            text: 'HTML檢視',
            className: 'small',
            onclick: openHtmlViewer.bind(this, value)
        });
    }
}

function openHtmlViewer(value, e) {
    e.stopPropagation();
    let win = window.open('/assets/htmlviewer.html', '', 'width=600px,height=300px');
    setTimeout(() => {
        let send;
        try {
            send = CUI.printJson(value || '');
        } catch (e) {
            send = value;
        }
        win.postMessage(send, window.location.origin);
    }, 1000);
}
