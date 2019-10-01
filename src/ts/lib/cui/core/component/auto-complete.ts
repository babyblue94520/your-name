import { CUI } from '../cui';
import { OverlayClassName } from './overlay';

interface OnRender<T, V> {
	(value: string, display: V, record: T);
}
interface OnInput<T> {
	(value: string, load: Load<T>);
}
interface OnSelect<T, K> {
	(value: K, record: T);
}
interface OnClose<T, K> {
	(value: K, record: T);
}

interface Load<T> {
	(records: T[]);
}
/**
 * T record 每筆資料型態
 * V OnRender display 資料型態
 * K onSelect value 資料型態
 */
export interface AutoCompleteConfig<T = any, V = string, K= any> {
	value: string; // 選取值
	display: string; // 顯示值
	delay?: number; // 查詢延遲時間
	data?: any[]; // 資料
	searchLength?: number;
	onRender?: OnRender<T, V>; // 選單資料顯示的處理事件
	onInput?: OnInput<T>; // 輸入事件
	onSelect?: OnSelect<T, K>; // 資料選取或者有符合資料的事件
	onClose?: OnClose<T, K>; // 清單關閉時
}

enum AutoCompleteClassName {
	Container = 'cui-autocomplete-container',
	List = 'cui-autocomplete-list',
	Items = 'cui-autocomplete-items',
	Item = 'cui-autocomplete-item',
	Sreach = 'cui-autocomplete-sreach',
	Bottom = 'cui-autocomplete-bottom'
}

/**
 * Input AutoComplete
 * 注意：使用到element.classList
 */
export class AutoComplete {
	private wrapperElement: HTMLElement;
	private containerElement: HTMLElement;
	private listElement;
	private itemsElement;
	private sreachElement;
	private itemElements: HTMLElement[] = [];
	private currentLoadId = 0;
	private inputTimer;
	private currentFocus = -1;
	private prevSearchText;
	private prevValue;
	private currentRecord;

	constructor(private inputElement: HTMLInputElement, private config?: AutoCompleteConfig) {
		this.containerElement = document.body.querySelector('.' + AutoCompleteClassName.Container);
		if (!this.containerElement) {
			this.containerElement = document.createElement('div');
			this.containerElement.className = AutoCompleteClassName.Container;
		}
		this.config = Object.assign({
			value: 'value',
			display: 'name',
			delay: 0,
			onRender: this.onRender,
			data: [],
		}, this.config);
		this.listElement = document.createElement('div');
		this.listElement.className = AutoCompleteClassName.List;
		this.itemsElement = document.createElement('div');
		this.itemsElement.className = AutoCompleteClassName.Items;
		this.listElement.appendChild(this.itemsElement);
		let bottom = document.createElement('div');
		bottom.style.height = '1em';
		bottom.className = AutoCompleteClassName.Bottom;
		this.listElement.appendChild(bottom);

		this.sreachElement = document.createElement('div');
		this.sreachElement.className = AutoCompleteClassName.Sreach;
		this.initEvent();
	}

	/**
	 * 更新配置
	 */
	public setConfig(value: AutoCompleteConfig) {
		this.config = Object.assign({
			value: 'value',
			display: 'name',
			delay: 0,
			onRender: this.onRender,
			data: [],
		}, value);
	}

	/**
	 * 清除值
	 */
	public clean() {
		this.inputElement.value = '';
		this.prevSearchText = '';
		this.prevValue = undefined;
		this.triggerSelect(undefined);
	}

	/**
	 * 破壞
	 */
	public destroy() {
		this.closeList();
		this.config = undefined;
		this.listElement = undefined;
		this.itemsElement = undefined;
		this.sreachElement = undefined;
		this.containerElement = undefined;
		this.prevValue = undefined;
	}

	/**
	 * 初始化事件
	 */
	private initEvent() {
		this.inputElement.addEventListener('input', this.onInput.bind(this));
		this.inputElement.addEventListener('click', this.onInput.bind(this));
		this.inputElement.addEventListener('keydown', this.onInputKeydown.bind(this));
	}

	/**
	 * 固定選單位置
	 */
	private fixed = (e?) => {
		let rect = this.inputElement.getBoundingClientRect();
		this.listElement.style.top = (this.wrapperElement.scrollTop + rect.top + this.inputElement.offsetHeight) + 'px';
		this.listElement.style.left = rect.left + 'px';
		this.listElement.style.width = this.inputElement.offsetWidth + 'px';
	}

	/**
	 * 找出要渲染的位置
	*/
	private findAppendWrapper(target: HTMLElement) {
		if (target.classList.contains(OverlayClassName.overlay)) {
			return target;
		} else if (target == document.body || target.parentElement == document.body) {
			return document.body;
		} else {
			return this.findAppendWrapper(target.parentElement);
		}
	}

	/**
	 * 輸入時
	 *
	 * @param {*} e
	 */
	private onInput(e) {
		if (!this.wrapperElement) {
			this.wrapperElement = this.findAppendWrapper(this.inputElement.parentElement);
			this.wrapperElement.appendChild(this.containerElement);
		}
		let value = this.inputElement.value;
		if (value.length < this.config.searchLength) {
			if (this.isOpen()) {
				clearTimeout(this.inputTimer);
				this.closeList();
				this.triggerSelect(undefined);
			}
			return;
		}
		if (this.prevSearchText == value) {
			return;
		}
		this.sreachElement.innerText = 'search \'' + value + '\'...';
		this.itemsElement.innerHTML = '';
		this.itemsElement.appendChild(this.sreachElement);
		this.prevSearchText = value;
		this.openList();
		clearTimeout(this.inputTimer);
		this.inputTimer = setTimeout(this.loadList.bind(this, ++this.currentLoadId, value), this.config.delay);
	}


	/**
	 * 載入列表
	 *
	 * @param {*} value
	 */
	private loadList(id, value) {
		if (this.config.onInput instanceof Function) {
			this.config.onInput.call(this.inputElement, value, this.createList.bind(this, id, value));
		} else {
			this.createList(id, value, this.config.data);
		}
	}

	/**
	 * input 鍵盤事件
	 */
	private onInputKeydown(e) {
		switch (e.keyCode) {
			case 40: // down
				e.preventDefault();
				if (this.itemElements.length == 0) {
					this.onInput(e);
				} else {
					if (++this.currentFocus >= this.itemElements.length) {
						this.currentFocus = 0;
					}
					this.focusItem();
				}
				break;
			case 38: // up
				e.preventDefault();
				if (--this.currentFocus < 0) {
					this.currentFocus = this.itemElements.length - 1;
				}
				this.focusItem();
				break;
			case 13: // enter
				e.preventDefault();
				if (this.currentFocus > -1 && this.currentFocus < this.itemElements.length) {
					this.itemElements[this.currentFocus].click();
				}
				break;
		}
	}

	/**
	 * 點擊選取
	 *
	 * @param {*} record
	 */
	private onItemClick(record, e) {
		this.closeList();
		this.triggerSelect(record);
	}

	/**
	 * 觸發選擇通知
	 *
	 * @param {*} value
	 * @param {*} record
	 */
	private triggerSelect(record) {
		this.currentRecord = record;
		let value, display;
		if (record) {
			value = this.getValue(record);
			display = this.getDisplay(record);
			this.inputElement.value = display;
		}
		if (this.config.onSelect instanceof Function) {
			if (this.prevValue != value) {
				this.config.onSelect(value, record);
				this.prevValue = value;
			}
		}
	}

	/**
	 * 鎖定Item
	 */
	private focusItem() {
		for (let i = 0, l = this.itemElements.length; i < l; i++) {
			if (i == this.currentFocus) {
				this.itemElements[i].classList.add('active');
			} else {
				this.itemElements[i].classList.remove('active');
			}
		}
	}

	/**
	 * 預設選項格式
	 */
	private onRender(value, display, record) {
		let index = display.toUpperCase().indexOf(value.toUpperCase());
		return display.substr(0, index) + '<strong>' + display.substr(index, value.length) + '</strong>' + display.substr(index + value.length);
	}

	/**
	 * 是否打開list
	*/
	private isOpen() {
		return CUI.isConnected(this.listElement);
	}

	/**
	 * 載入資料
	 *
	 * @param {*} id
	 * @param {*} value
	 * @param {*} array
	 */
	private createList(id, value, array) {
		if (id != this.currentLoadId) {
			return;
		}
		if (!array || array.length == 0) {
			this.sreachElement.innerText = 'Not find \'' + value;
			this.itemsElement.innerHTML = '';
			this.itemsElement.appendChild(this.sreachElement);
			return;
		}
		this.cleanList();
		let item, record, display, index, sameRecord;
		for (let i = 0; i < array.length; i++) {
			record = array[i];
			display = this.getDisplay(record);
			index = display.toUpperCase().indexOf(value.toUpperCase());
			if (index != -1) {
				item = document.createElement('div');
				item.className = AutoCompleteClassName.Item;
				item.innerHTML = this.config.onRender.call(this, value, display, record);
				item.addEventListener('click', this.onItemClick.bind(this, record));
				this.itemsElement.appendChild(item);
				this.itemElements.push(item);
				if (display.length == value.length) {
					sameRecord = record;
					item.classList.add('active');
				}
			}
		}
		if (this.itemsElement.childElementCount == 0) {
			this.sreachElement.innerText = 'Not find \'' + value;
			this.itemsElement.innerHTML = '';
			this.itemsElement.appendChild(this.sreachElement);
		}
		this.triggerSelect(sameRecord);
		this.fixed();
	}

	/**
	 * 清除清單
	 */
	private cleanList() {
		this.itemsElement.innerHTML = '';
		this.itemElements.length = 0;
		this.currentFocus = -1;
	}

	/**
	 * 延遲關閉清單
	 */
	private windowCloseList = (e: Event) => {
		if (e && e.target == this.inputElement) {
			return;
		}
		this.closeList();
	}

	/**
	 * 開啟選單
	 */
	private openList() {
		if (this.isOpen()) {
			return;
		}
		this.containerElement.innerHTML = '';
		this.containerElement.appendChild(this.listElement);

		window.removeEventListener('click', this.windowCloseList);
		window.removeEventListener('resize', this.fixed);
		this.wrapperElement.removeEventListener('scroll', this.fixed);

		window.addEventListener('click', this.windowCloseList);
		window.addEventListener('resize', this.fixed);
		this.wrapperElement.addEventListener('scroll', this.fixed);
		this.fixed();
	}

	/**
	 * 關閉選單
	 */
	private closeList() {
		window.removeEventListener('click', this.windowCloseList);
		window.removeEventListener('resize', this.fixed);
		if (this.wrapperElement) {
			this.wrapperElement.removeEventListener('scroll', this.fixed);
		}

		this.cleanList();
		CUI.remove(this.listElement);
		this.prevSearchText = undefined;
		this.prevValue = undefined;

		let value;
		if (this.currentRecord) {
			value = this.getValue(this.currentRecord);
		}
		if (this.config.onClose instanceof Function) {
			this.config.onClose(value, this.currentRecord);
		}
		this.currentRecord = undefined;
	}

	/**
	 * 取得顯示的值
	 *
	 * @param {*} record
	 */
	private getDisplay(record) {
		if (record) {
			return record[this.config.display];
		} else {
			return '';
		}
	}

	/**
	 * 取得實際回傳值
	 *
	 * @param {*} record
	 */
	private getValue(record: any) {
		if (record) {
			return record[this.config.value];
		} else {
			return '';
		}
	}
}
