export interface AutoCompleteConfig {
	value: string; // 選取值
	display: string; // 顯示值
	delay?: number; // 查詢延遲時間
	data?: any[]; // 資料
	searchLength?: number;
	onRender?: Function;
	onInput?: Function; // 輸入事件
	onSelect?: Function;
}

/**
 * Input AutoComplete
 * 注意：使用到element.classList
 */
export class AutoComplete {
	private listElement;
	private selectRecord;
	private currentLoadId = 0;
	private inputTimer;
	private itemElements = [];
	private currentFocus = -1;

	constructor(private inputElement: HTMLInputElement, private config?: AutoCompleteConfig) {
		this.config = Object.assign({
			value: 'value',
			display: 'name',
			delay: 0,
			onRender: this.onRender,
			data: [],
		}, this.config);

		this.listElement = document.createElement('div');
		this.listElement.className = 'cui-autocomplete-list';
		this.initEvent();
	}

	public setConfig(value: AutoCompleteConfig) {
		this.config = Object.assign({
			value: 'value',
			display: 'name',
			delay: 0,
			onRender: this.onRender,
			data: [],
		}, value);
	}

	public getValue(record?: any) {
		if (record) {
			return record[this.config.value] || record;
		} else {
			return this.selectRecord && this.selectRecord[this.config.value];
		}
	}

	public getSelectRecord() {
		return this.selectRecord;
	}

	public clean() {
		this.inputElement.value = '';
		this.cleanSelect();
	}

	/**
	 * 初始化事件
	 */
	private initEvent() {
		this.inputElement.addEventListener('input', this.onInput);
		this.inputElement.addEventListener('blur', this.closeList);
		this.inputElement.addEventListener('click', this.onInput);
		this.inputElement.addEventListener('keydown', this.onInputKeydown);
	}

	/**
	 * 觸發選擇通知
	 *
	 * @param {*} value
	 * @param {*} record
	 */
	private triggerSelect(value, record) {
		if (this.config.onSelect instanceof Function) {
			this.config.onSelect(value, record);
		}
	}

	/**
	 * 點擊選取
	 *
	 * @param {*} record
	 */
	private onItemClick = (record) => {
		this.selectRecord = record;
		let value = this.getValue(this.selectRecord);
		let display = this.getDisplay(this.selectRecord);
		this.inputElement.value = display;
		this.closeList();
		this.triggerSelect(value, this.selectRecord);
	}

	/**
	 * 鎖定Item
	 */
	private focusItem = () => {
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
	private onRender = (value, display, record) => {
		return '<strong>' + display.substr(0, value.length) + '</strong>' + display.substr(value.length);
	}

	/**
	 * 載入資料
	 *
	 * @param {*} id
	 * @param {*} value
	 * @param {*} array
	 */
	private loadList = (id, value, array) => {
		if (id != this.currentLoadId) {
			return;
		}
		if (!array || array.length == 0) {
			this.listElement.innerHTML = '<div>Not find \'' + value + '\'</div>';
			return;
		}
		this.cleanList();
		this.cleanSelect();
		let item, record, display;
		for (let i = 0; i < array.length; i++) {
			record = array[i];
			display = this.getDisplay(record);
			if (display.substr(0, value.length).toUpperCase() == value.toUpperCase()) {
				item = document.createElement('div');
				item.innerHTML = this.config.onRender.call(item, value, display, record);
				item.addEventListener('click', this.onItemClick.bind(this, record));
				this.listElement.appendChild(item);
				this.itemElements.push(item);
				if (display.length == value.length) {
					this.selectRecord = record;
					item.classList.add('active');
				}
			}
		}
		if (this.listElement.childElementCount == 0) {
			this.listElement.innerHTML = '<div>Not find \'' + value + '\'</div>';
		}
		if (this.selectRecord) {
			this.triggerSelect(this.getValue(this.selectRecord), this.selectRecord);
		}
	}

	/**
	 * 輸入時
	 *
	 * @param {*} e
	 */
	private onInput = (e) => {
		let value = this.inputElement.value;
		if (!value || value.length < this.config.searchLength) {
			clearTimeout(this.inputTimer);
			this.cleanSelect();
			this.closeList();
			this.triggerSelect('', undefined);
			return;
		}
		let rect = this.inputElement.getBoundingClientRect();

		this.listElement.style.top = (rect.top + this.inputElement.offsetHeight) + 'px';
		this.listElement.style.left = rect.left + 'px';
		this.listElement.style.width = this.inputElement.offsetWidth + 'px';
		this.listElement.innerHTML = '<div>search \'' + value + '\'...</div>';
		this.inputElement.parentElement.appendChild(this.listElement);

		window.addEventListener('click', this.closeList);
		clearTimeout(this.inputTimer);
		this.inputTimer = setTimeout(this.delayLoadList.bind(this, ++this.currentLoadId, value), this.config.delay);
	}

	/**
	 * 延遲載入列表
	 *
	 * @param {*} value
	 */
	private delayLoadList = (id, value) => {
		if (this.config.onInput instanceof Function) {
			this.config.onInput.call(this.inputElement, value, this.loadList.bind(this, id, value));
		} else {
			this.loadList(id, value, this.config.data);
		}
	}


	private onInputKeydown = (e) => {
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
	 * 清除選取
	 */
	private cleanSelect = () => {
		this.selectRecord = undefined;
	}

	/**
	 * 清除清單
	 */
	private cleanList = () => {
		this.listElement.innerHTML = '';
		this.itemElements.length = 0;
		this.currentFocus = -1;
	}

	/**
	 * 關閉清單
	 */
	private closeList = (e?: Event) => {
		if (e && e.target instanceof HTMLInputElement && e.type == 'click') {
			return;
		}
		this.cleanList();
		this.listElement.remove();
		window.removeEventListener('click', this.closeList);
	}

	/**
	 * 取得顯示的值
	 *
	 * @param {*} record
	 */
	private getDisplay = (record) => {
		return record[this.config.display] || record;
	}

}
