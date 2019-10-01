import { Async } from "../decorators/async";

export abstract class GlobleTooltip {
    private static wrap: HTMLDivElement;

    constructor() {

    }

    public static text(message: string) {
        this.init();
        let text = document.createElement('div');
        text.className = 'cui-g-t-message';
        text.innerText = message;
        this.wrap.appendChild(text);
        this.hide(text);
    }

    @Async(2000)
    private static hide(text: HTMLDivElement) {
        text.classList.add('hide');
        this.remove(text);
    }


    @Async(500)
    private static remove(text: HTMLDivElement) {
        text.remove();
    }

    private static init() {
        if (!this.wrap) {
            this.wrap = document.createElement('div');
            this.wrap.className = 'cui-globle-tooltip';
            document.body.appendChild(this.wrap);
        }
    }
}