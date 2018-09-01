import { CUI } from '../cui';

/**
 * 表格
 */
export namespace Grid {

    export enum ClassName {
        Grid = 'cui-grid',
        Container = 'cui-grid-container',
        Header = 'cui-grid-header',
        Body = 'cui-grid-body',
        Footer = 'cui-grid-footer',
        Column = 'cui-grid-column',
        ColumnDiv = 'cui-grid-td-div',
        Content = 'cui-grid-content',
        Desc = 'flaticon-down',
        Asc = 'flaticon-up',
        Sort = 'sort',
        FirstPage = 'first-page  flaticon-first',
        PrevPage = 'prev-page flaticon-prev',
        NextPage = 'next-page flaticon-next',
        LastPage = 'last-page flaticon-last',
        PageInfo = 'page-info',
        RowInfo = 'row-info',
        PageInput = 'page-input',
        Disable = 'disable',
        HasContent = 'has-content',
        Show = 'show',
    }

    /**
     * 排序列舉
     */
    export enum Sort {
        Desc = 'DESC',
        Asc = 'ASC',
    }

    export interface IExportConfig {
        tableStyle?: string;
        theadStyle?: string;
        tbodyStyle?: string;
        tdStyle?: string;
    }

    /**
     * 配置
     */
    export interface IConfig<T> {
        rowColumns: IColumnConfig<T>[];
        size?: number;
        height?: string;
        width?: string;
        index?: boolean;
        singleSort?: boolean;
        scroll?: boolean;
        contentColumns?: IColumnConfig<T>[];
        onLoad?: IOnLoad<T>;
    }

    /**
     * 欄位介面
     */
    export interface IColumnConfig<T> {
        value: string;
        name: string;
        sort?: Sort;
        canSort?: boolean;
        className?: string;
        align?: string;
        width?: string;
        maxWidth?: string;
        minWidth?: string;
        nowrap?: boolean;
        html?: boolean;
        element?: boolean;
        onRender?: IColumnRender<T>;
    }

    /**
     * 欄位渲染方法介面
     */
    export type IColumnRender<T> = (value: any, record: T, index: number) => any;

    export interface IGridColumn<T> {
        config: IColumnConfig<T>;
        render: IColumnRender<T>;
    }

    /**
     *
     */
    export type IOnLoad<T> = (pageable: IPageable, load: ILoad<T>) => any;

    /**
     *
     */
    export type ILoad<T> = (page: IPage<T> | T[]) => any;

    export interface IPageable {
        // 每頁顯示數量
        size: number;
        // 頁碼
        page: number;
        // 排序
        sort: string[];
    }

    export interface IPage<T> {
        // 返回資料
        content: T[];
        // 是否第一筆
        first?: boolean;
        // 是否最後一筆
        last?: boolean;
        // 目前頁碼
        number: number;
        // 資料筆數
        numberOfElements?: number;
        // 每頁顯示筆數
        size: number;
        // 排序
        sort?: IPageSort[];
        // 總共幾筆
        totalElements?: number;
        // 總共幾頁
        totalPages?: number;
    }

    export interface IPageSort {
        // 排序類型
        direction: Sort;
        // 排序欄位
        property: string;
    }

    export function htmlRender(onRender: IColumnRender<any>, value, record, index) {
        let render = onRender.call(this, value, record, index);
        if (this instanceof Element) {
            (<HTMLElement>this).innerHTML = render;
        } else {
            return render;
        }
    }
    export function elementRender(onRender: IColumnRender<any>, value, record, index) {
        try {
            let render = onRender.call(this, value, record, index);

            if (this instanceof Element) {
                if (CUI.isArray(render)) {
                    let el;
                    for (let i in render) {
                        el = render[i];
                        if (el instanceof Element) {
                            (<HTMLElement>this).appendChild(el);
                        }
                    }
                } else {
                    if (render instanceof Element) {
                        (<HTMLElement>this).appendChild(render);
                    }
                }
            } else {
                return render;
            }
        } catch (e) {
            console.error(e);
        }
    }
    export function textRender(onRender: IColumnRender<any>, value, record, index) {
        let render = onRender.call(this, value, record, index);
        if (this instanceof Element) {
            (<HTMLElement>this).innerText = render;
        } else {
            return render;
        }
    }
    export function valueRender(onRender: IColumnRender<any>, value, record, index) {
        if (this instanceof Element) {
            (<HTMLElement>this).innerText = value;
        } else {
            return value;
        }
    }

    export class PageGridBuilder {

        public static build<T>(config: IConfig<T>): PageGrid<T> {
            if (!config.rowColumns || config.rowColumns.length == 0) {
                throw new Error('rowColumns is required');
            }
            return new PageGrid<T>(config);
        }

        /**
         *
         * @param config 檢查
         */
        public static checkColumnConfig<T>(config: IColumnConfig<T>) {
            if (config.value == undefined) {
                throw new Error('column value is required');
            }
            if (config.name == undefined) {
                throw new Error('column name is required');
            }
        }

        public static buildColumnConfig<T>(config: IColumnConfig<T>): IColumnConfig<T> {
            PageGridBuilder.checkColumnConfig(config);
            return CUI.deepClone({
                value: '',
                name: '',
                className: '',
                sort: '',
                canSort: false,
                align: 'left',
                width: 'auto',
                nowrap: true,
                html: false,
                element: false
            }, config);
        }

        /**
         * 產生表頭
         */
        public static buildGridHeaderElement<T>(config: IColumnConfig<T>): HTMLElement {
            let element = document.createElement('th');
            let className = ClassName.Column + ' ' + (config.canSort ? ClassName.Sort : '');
            element.className = className;
            element.noWrap = true;
            element.align = 'center';
            element.width = config.width;
            element.innerText = config.name;
            return element;
        }

        /**
         * 產生每筆資料的 tr
         * @param columns
         * @param index
         * @param record
         */
        public static buildEmptyGridRecordElement<T>(count: number): HTMLElement {
            let tr: HTMLElement = document.createElement('tr');
            tr.className = 'empty';
            let td: HTMLTableCellElement = document.createElement('td');
            td.colSpan = count;
            td.align = 'center';
            td.innerText = '無資料';
            tr.appendChild(td);
            return tr;
        }

        /**
         * 產生每筆資料的 tr
         * @param columns
         * @param index
         * @param record
         */
        public static buildGridRecordElement<T>(columns: IGridColumn<T>[], index: number, record: T): HTMLElement {
            let tr: HTMLElement = document.createElement('tr');
            let column: IGridColumn<T>, config: IColumnConfig<T>, td: HTMLTableCellElement, div: HTMLElement;
            for (let i in columns) {
                column = columns[i];
                config = column.config;
                td = document.createElement('td');
                tr.appendChild(td);
                td.className = ClassName.Column;
                td.align = config.align;
                td.noWrap = config.nowrap;
                div = document.createElement('div');
                td.appendChild(div);
                td.width = config.width;
                if (config.maxWidth) {
                    div.style.maxWidth = config.maxWidth;
                }
                if (config.minWidth) {
                    div.style.minWidth = config.minWidth;
                }
                div.className = ClassName.ColumnDiv + ' ' + config.className;

                column.render.call(div, config.onRender, PageGridBuilder.getValue(config.value, record), record, index);
            }
            return tr;
        }

        /**
         * 產生每筆資料的 content
         * @param columns
         * @param index
         * @param record
         */
        public static buildGridRecordContentElement<T>(colSpan: number, columns: IGridColumn<T>[], index: number, record: T): HTMLElement {
            let tr: HTMLElement = document.createElement('tr');
            tr.className = ClassName.Content;
            let td = document.createElement('td');
            td.colSpan = colSpan;
            tr.appendChild(td);
            return tr;
        }

        /**
         * 延遲加載content
         * @param columns
         * @param index
         * @param record
         */
        public static loadContent<T>(columns: IGridColumn<T>[], index: number, record: T): HTMLElement {
            let table: HTMLElement = document.createElement('table');
            let column: IGridColumn<T>, config: IColumnConfig<T>, tr: HTMLTableRowElement, label: HTMLTableCellElement, content: HTMLTableCellElement, colon;
            for (let i in columns) {
                tr = document.createElement('tr');
                column = columns[i];
                config = column.config;
                label = document.createElement('td');
                label.align = 'left';
                label.width = '1%';
                label.noWrap = true;
                label.innerText = config.name;
                if (config.name) {
                    colon = document.createElement('span');
                    colon.innerText = '：';
                    label.appendChild(colon);
                }
                content = document.createElement('td');
                content.align = 'left';
                content.width = '100%';
                column.render.call(content, config.onRender, PageGridBuilder.getValue(config.value, record), record, index);
                tr.appendChild(label);
                tr.appendChild(content);
                table.appendChild(tr);
            }
            return table;
        }

        /**
         *
         * @param column 產生渲染方法
         */
        public static builderGridColumnRenderHandler<T>(config: IColumnConfig<T>): Function {
            if (config.onRender instanceof Function) {
                if (config.html) {
                    return htmlRender;
                } else if (config.element) {
                    return elementRender;
                } else {
                    return textRender;
                }
            } else {
                return valueRender;
            }
        }


        /**
         * 解析 key  ex: id.time
         * @param key
         * @param record
         */
        public static getValue(key: string, record: any) {
            if (CUI.isEmpty(key)) {
                return undefined;
            }
            let vs = key.split('.'), value = record;
            for (let i in vs) {
                value = value[vs[i]];
            }
            return value;
        }
    }

    /**
     * 分頁表格
     */
    export class PageGrid<T> {
        private _config: IConfig<T> = {
            size: 50,
            height: 'auto',
            width: '100%',
            index: false,
            scroll: false,
            singleSort: true,
            rowColumns: null,
            contentColumns: null,
            onLoad: null
        };
        private _element: HTMLElement;
        private _columns: IGridColumn<T>[];
        private _columnContents: IGridColumn<T>[];
        private _headerElements: HTMLElement[];
        private _gridElement: HTMLElement;
        private _tableElement: HTMLElement;
        private _theadElement: HTMLElement;
        private _tbodyElement: HTMLElement;
        private _footerElement: HTMLElement;
        // private _footerLeftElement: HTMLTableCellElement;
        // private _footerRightElement: HTMLTableCellElement;
        private _footerLeftElement: HTMLElement;
        private _footerRightElement: HTMLElement;

        private _firstPageElement: HTMLDivElement;
        private _prevPageElement: HTMLDivElement;
        private _nextPageElement: HTMLDivElement;
        private _lastPageElement: HTMLDivElement;

        private _pageInfoElement: HTMLDivElement;
        private _pageInputElement: HTMLInputElement;
        private _pageTotalTextNode: Text;

        private _rowTotalTextNode: Text;
        private _rowCUItTextNode: Text;
        private _rowEndTextNode: Text;

        private _defaultSorts = {};
        private _sorts = {};
        private _pageable: IPageable;
        private _page: IPage<T>;

        constructor(config: IConfig<T>) {
            this._config = CUI.deepClone(this._config, config);

            this.initElement();
            this.initPageable();
            this._page = {
                content: [],
                number: 0,
                numberOfElements: 0,
                sort: this.getPageSort(),
                size: this._config.size,
                first: true,
                last: true,
                totalElements: 0,
                totalPages: 0
            };
            this.setFooterPageInfo();
        }

        /**
         * 取得element
         */
        public getElement = (): HTMLElement => {
            return this._element;
        }

        public resize = (height: number) => {
            this._gridElement.style.height = (height - this._gridElement.offsetTop - this._footerElement.offsetHeight - 10) + 'px';
        }

        /**
         * 初始化Pageable
         */
        public initPageable() {
            this._sorts = CUI.deepClone(this._defaultSorts);
            this._pageable = {
                size: this._config.size,
                page: 0,
                sort: this.getSortArray(),
            };
            this.setHeaderColumnSort();
        }

        /**
         * 匯出html
         */
        public export = (config: IExportConfig, records: T[]): string => {
            let html = '<table style="' + (config.tableStyle || '') + '">';
            html += '<thead ><tr style="' + (config.theadStyle || '') + '">';
            let column: IGridColumn<T>, columnConfig: IColumnConfig<T>;
            for (let i in this._columns) {
                column = this._columns[i];
                columnConfig = column.config;
                html += '<th align="center" nowrap width="' + columnConfig.width + '">' + columnConfig.name + '</th>';
            }
            html += '</tr></thead>';
            html += '<tbody>';
            let record;
            for (let i = 0, l = records.length; i < l; i++) {
                record = records[i];
                if (!record) {
                    continue;
                }
                html += '<tr>';
                let value;
                for (let j in this._columns) {
                    column = this._columns[j];
                    columnConfig = column.config;
                    value = column.render.call(null, columnConfig.onRender, PageGridBuilder.getValue(columnConfig.value, record), record, i);
                    html += '<td align="' + columnConfig.align + '" nowrap style="' + config.tdStyle + '" width="' + columnConfig.width + '">' + value + '</td>';
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        }

        /**
         * 載入資料
         */
        public load = (data?: IPage<T> | T[]) => {
            if (data) {
                let page: IPage<T>;
                if (CUI.isArray(data)) {
                    let length = (<T[]>data).length;
                    page = {
                        content: data as T[],
                        number: 0,
                        sort: this.getPageSort(),
                        size: length,
                        first: true,
                        last: true,
                        totalElements: length,
                        totalPages: 0
                    };
                } else {
                    page = data as IPage<T>;
                }
                this._page = page;
            }
            this.initPageable();
            this.onLoad();
        }

        /**
         * 刷新
         */
        public reload() {
            this.onLoad();
        }

        /**
         * 第一頁
         */
        private onFirstPageClick = () => {
            if (!this._page.first) {
                this._pageable.page = 0;
                this.onLoad();
            }
        }

        /**
         * 上一頁
         */
        private onPrevPageClick = () => {
            if (!this._page.first) {
                this._pageable.page -= 1;
                this.onLoad();
            }
        }

        /**
         * 下一頁
         */
        private onNextPageClick = () => {
            if (!this._page.last) {
                this._pageable.page += 1;
                this.onLoad();
            }
        }

        /**
         * 最後一頁
         */
        private onLastPageClick = () => {
            if (!this._page.last) {
                this._pageable.page = this._page.totalPages - 1;
                this.onLoad();
            }
        }

        /**
         * 禁止輸入非數字
         */
        private onPageKeydown = (e) => {
            if (e.keyCode == 8) { return; }
            return /\d/.test(e.key);
        }

        /**
         *
         */
        private onPageInput = (e) => {
            let value = Number(this._pageInputElement.value);
            if (value < 1) {
                value = 1;
            } else if (value > this._page.totalPages) {
                value = this._page.totalPages;
            }
            this._pageInputElement.value = String(value);
        }

        /**
         * page input enter load
         */
        private onPageEnter = (e) => {
            let value = Number(this._pageInputElement.value) - 1;
            if (value != this._pageable.page) {
                this._pageable.page = value;
                this.onLoad();
            }
        }


        /**
         * 排序事件
         */
        private onSort = (id, sort) => {
            if (sort) {
                if (this._config.singleSort) {
                    this._sorts = {};
                }
                this._sorts[id] = sort;
            } else {
                delete this._sorts[id];
            }
            this._pageable.sort = this.getSortArray();
            this.onLoad();
        }

        /**
         * 載入事件
         */
        private onLoad = () => {
            if (this._config.onLoad instanceof Function) {
                this._config.onLoad(this._pageable, this.doLoadPage);
            } else {
                this._page.number = this._pageable.page;
                this.doLoadPage(this._page);
            }
        }

        /**
         * 執行載入資料
         */
        private doLoadPage = (page: IPage<T> | T[]) => {
            if (page) {
                if (CUI.isArray(page)) {
                    let length = (<T[]>page).length;
                    page = {
                        content: page as T[],
                        number: 0,
                        sort: this.getPageSort(),
                        size: length,
                        first: true,
                        last: true,
                        totalElements: length,
                        totalPages: 0
                    } as IPage<T>;
                }
                page = page as IPage<T>;
                let total = page.totalElements;
                let size = page.size;
                let totalPage = Math.ceil(total == 0 ? 0 : total / size);
                page.first = (page.number == 0);
                page.last = (total == 0) || (page.number + 1 == totalPage);
                page.totalPages = totalPage;
                page.numberOfElements = page.content.length;
                this._page = page;
                this.updateSorts(page);
                this.resetPageable(page);
                this.setHeaderColumnSort();
                if (this._columnContents && this._columnContents.length > 0) {
                    this.loadTbodyContent(this._page.content);
                } else {
                    this.loadTbody(this._page.content);
                }
            }
            this.setFooterPageInfo();
        }

        /**
         * 初始化grid element
         */
        private initElement = () => {
            this._element = document.createElement('div');
            this._element.className = ClassName.Grid;
            if (this._config.width) {
                this._element.style.width = this._config.width;
            }
            this._gridElement = document.createElement('div');
            this._element.appendChild(this._gridElement);
            if (this._config.height) {
                this._gridElement.style.height = this._config.height;
            }
            this._gridElement.style.height = this._config.height;
            this._gridElement.className = ClassName.Container;
            this._tableElement = document.createElement('table');
            this._gridElement.appendChild(this._tableElement);
            this._theadElement = document.createElement('thead');
            this._tableElement.appendChild(this._theadElement);
            // this._theadElement.className = ClassName.Header;
            this._tbodyElement = document.createElement('tbody');
            this._tableElement.appendChild(this._tbodyElement);
            // this._tbodyElement.className = ClassName.Body;
            this._footerElement = document.createElement('div');
            this._element.appendChild(this._footerElement);
            // this._footerElement = document.createElement('table');
            this._footerElement.className = ClassName.Footer;
            // this._element.appendChild(this._footerElement);
            this.initHeaderColumn();
            this.initFooter();
        }

        /**
         * 初始化表頭
         */
        private initHeaderColumn = () => {
            this._headerElements = [];
            this._columns = [];
            let colConfig: IColumnConfig<T>, hElement: HTMLElement;
            let tr = document.createElement('tr');
            let column;
            for (let i in this._config.rowColumns) {
                column = this._config.rowColumns[i];
                if (!column) {
                    continue;
                }
                colConfig = PageGridBuilder.buildColumnConfig(column);
                this.setSorts(colConfig);
                this._columns.push({
                    config: colConfig,
                    render: PageGridBuilder.builderGridColumnRenderHandler(colConfig)
                } as IGridColumn<T>);
                hElement = PageGridBuilder.buildGridHeaderElement(colConfig);
                hElement.addEventListener('click', onHeaderClick.bind(hElement, colConfig.value, this.onSort));
                tr.appendChild(hElement);
                this._headerElements.push(hElement);
            }
            this._theadElement.appendChild(tr);

            this._columnContents = [];
            if (this._config.contentColumns) {
                for (let i in this._config.contentColumns) {
                    column = this._config.contentColumns[i];
                    if (!column) {
                        continue;
                    }
                    colConfig = PageGridBuilder.buildColumnConfig(column);
                    this._columnContents.push({
                        config: colConfig,
                        render: PageGridBuilder.builderGridColumnRenderHandler(colConfig)
                    } as IGridColumn<T>);
                }
            }
        }

        /**
         * 底部
         */
        private initFooter = () => {
            this._footerLeftElement = document.createElement('div');
            this._footerLeftElement.className = 'left-info';
            this._firstPageElement = document.createElement('div');
            this._prevPageElement = document.createElement('div');
            this._nextPageElement = document.createElement('div');
            this._lastPageElement = document.createElement('div');

            this._pageInputElement = document.createElement('input');
            this._pageInputElement.onkeydown = this.onPageKeydown;
            this._pageInputElement.oninput = this.onPageInput;
            CUI.addListenOnEnter(this._pageInputElement, this.onPageEnter);
            this._pageInfoElement = document.createElement('div');
            this._pageTotalTextNode = document.createTextNode('');
            this._pageInfoElement.className = ClassName.PageInfo;
            this._pageInfoElement.appendChild(document.createTextNode('Page '));
            this._pageInfoElement.appendChild(this._pageInputElement);
            this._pageInfoElement.appendChild(document.createTextNode(' of '));
            this._pageInfoElement.appendChild(this._pageTotalTextNode);

            this._firstPageElement.className = ClassName.FirstPage;
            this._prevPageElement.className = ClassName.PrevPage;
            this._nextPageElement.className = ClassName.NextPage;
            this._lastPageElement.className = ClassName.LastPage;
            this._firstPageElement.addEventListener('click', this.onFirstPageClick);
            this._prevPageElement.addEventListener('click', this.onPrevPageClick);
            this._nextPageElement.addEventListener('click', this.onNextPageClick);
            this._lastPageElement.addEventListener('click', this.onLastPageClick);

            this._footerLeftElement.appendChild(this._firstPageElement);
            this._footerLeftElement.appendChild(this._prevPageElement);
            this._footerLeftElement.appendChild(this._pageInfoElement);
            this._footerLeftElement.appendChild(this._nextPageElement);
            this._footerLeftElement.appendChild(this._lastPageElement);

            this._footerRightElement = document.createElement('div');
            this._footerRightElement.className = 'right-info';
            this._rowCUItTextNode = document.createTextNode('');
            this._rowEndTextNode = document.createTextNode('');
            this._rowTotalTextNode = document.createTextNode('');
            this._footerRightElement.appendChild(document.createTextNode('Row '));
            this._footerRightElement.appendChild(this._rowCUItTextNode);
            this._footerRightElement.appendChild(document.createTextNode(' - '));
            this._footerRightElement.appendChild(this._rowEndTextNode);
            this._footerRightElement.appendChild(document.createTextNode(' of '));
            this._footerRightElement.appendChild(this._rowTotalTextNode);

            this._footerElement.appendChild(this._footerLeftElement);
            this._footerElement.appendChild(this._footerRightElement);
        }

        /**
         * 設定header排序className
         */
        private setHeaderColumnSort() {
            let colConfig: IColumnConfig<T>, hElement: HTMLElement;
            let sort: string;
            let column;
            for (let i in this._config.rowColumns) {
                column = this._config.rowColumns[i];
                if (!column) {
                    continue;
                }
                colConfig = PageGridBuilder.buildColumnConfig(column);
                hElement = this._headerElements[i];
                sort = this._sorts[colConfig.value];
                if (sort) {
                    if (sort.toUpperCase() == Sort.Desc) {
                        hElement.classList.remove(ClassName.Asc);
                        hElement.classList.add(ClassName.Desc);
                    } else {
                        hElement.classList.remove(ClassName.Desc);
                        hElement.classList.add(ClassName.Asc);
                    }
                } else {
                    hElement.classList.remove(ClassName.Desc);
                    hElement.classList.remove(ClassName.Asc);
                }

            }
        }


        /**
         * 設定底頁資訊
         */
        private setFooterPageInfo = () => {
            let page = this._page.number;
            let startRow = page * this._page.size;
            let endRow;
            if (this._page.totalElements == this._page.size) {
                endRow = startRow + this._page.size;
            } else {
                endRow = startRow + this._page.numberOfElements;
            }

            this._rowCUItTextNode.data = String(startRow + 1);
            this._rowEndTextNode.data = String(endRow);
            this._rowTotalTextNode.data = String(this._page.totalElements);
            this._pageInputElement.value = String(page + 1);
            this._pageTotalTextNode.data = String(this._page.totalPages);

            if (this._page.first) {
                this._firstPageElement.classList.add(ClassName.Disable);
                this._prevPageElement.classList.add(ClassName.Disable);
            } else {
                this._firstPageElement.classList.remove(ClassName.Disable);
                this._prevPageElement.classList.remove(ClassName.Disable);
            }
            if (this._page.last) {
                this._nextPageElement.classList.add(ClassName.Disable);
                this._lastPageElement.classList.add(ClassName.Disable);
            } else {
                this._nextPageElement.classList.remove(ClassName.Disable);
                this._lastPageElement.classList.remove(ClassName.Disable);
            }
        }

        /**
         * 將資料載入到 tbody
         */
        private loadTbody = (records: T[]) => {
            if (records) {
                this._tbodyElement.innerHTML = '';
                let tbody: DocumentFragment = document.createDocumentFragment();
                let tr: HTMLElement;
                if (records.length > 0) {
                    let record;
                    for (let i = 0, l = records.length; i < l; i++) {
                        record = records[i];
                        if (!record) {
                            continue;
                        }
                        tr = PageGridBuilder.buildGridRecordElement(this._columns, i, record);
                        tbody.appendChild(tr);
                    }
                } else {
                    tr = PageGridBuilder.buildEmptyGridRecordElement(this._columns.length);
                    tbody.appendChild(tr);
                }
                this._tbodyElement.appendChild(tbody);
            }
        }

        /**
         * 將資料載入到 tbody
         */
        private loadTbodyContent = (records: T[]) => {
            if (records) {
                this._tbodyElement.innerHTML = '';
                let tbody: DocumentFragment = document.createDocumentFragment();
                let tr: HTMLElement, content: HTMLElement;
                if (records.length > 0) {
                    let record;
                    let colSpan = this._headerElements.length;
                    for (let i = 0, l = records.length; i < l; i++) {
                        record = records[i];
                        if (!record) {
                            continue;
                        }
                        tr = PageGridBuilder.buildGridRecordElement(this._columns, i, record);
                        content = PageGridBuilder.buildGridRecordContentElement(colSpan, this._columnContents, i, record);
                        tr.addEventListener('click', onTrClick.bind(tr, this._columnContents, record, i));
                        tr.classList.add(ClassName.HasContent);
                        tbody.appendChild(tr);
                        tbody.appendChild(content);
                    }
                } else {
                    tr = PageGridBuilder.buildEmptyGridRecordElement(this._columns.length);
                    tbody.appendChild(tr);
                }
                this._tbodyElement.appendChild(tbody);
            }
        }

        /**
         * 重新設定分頁
         */
        private resetPageable = (page: IPage<T>) => {
            if (page) {
                this._pageable = {
                    size: page.size,
                    page: page.number,
                    sort: this.getSortArray(),
                };
            }
        }

        /**
         * 取得排序
         */
        private getPageSort = (): IPageSort[] => {
            let array: IPageSort[] = [];
            if (this._sorts) {
                for (let id in this._sorts) {
                    array.push({
                        direction: this._sorts[id],
                        property: id
                    });
                }
            }
            return array;
        }

        /**
         * 取得排序字串陣列
         */
        private getSortArray = (): string[] => {
            let array = [];
            if (this._sorts) {
                for (let id in this._sorts) {
                    array.push(id + ',' + this._sorts[id]);
                }
            }
            return array;
        }

        /**
         * 設定排序
         */
        private setSorts = (config: IColumnConfig<T>) => {
            if (config && config.sort) {
                this._defaultSorts[config.value] = config.sort;
            }
        }

        /**
         * 重新設定排序
         */
        private updateSorts = (page: IPage<T>) => {
            this._sorts = {};
            if (page && page.sort) {
                let sort: IPageSort;
                for (let i in page.sort) {
                    sort = page.sort[i];
                    this._sorts[sort.property] = sort.direction;
                }
            }
        }
    }

    /**
     * 表頭點擊排序事件
     * Desc > Asc > 無
     * @param id
     * @param afterHandler
     * @param e
     */
    export function onHeaderClick(id, afterHandler, e) {
        let el = this as HTMLElement;
        if (el.classList.contains(ClassName.Sort)) {
            if (el.classList.contains(ClassName.Desc)) {
                el.classList.add(ClassName.Asc);
                el.classList.remove(ClassName.Desc);
                afterHandler(id, Sort.Asc);
            } else if (el.classList.contains(ClassName.Asc)) {
                el.classList.remove(ClassName.Asc);
                el.classList.remove(ClassName.Desc);
                afterHandler(id);
            } else {
                el.classList.add(ClassName.Desc);
                el.classList.remove(ClassName.Asc);
                afterHandler(id, Sort.Desc);
            }
        }
    }

    export function onTrClick(columnContents, record, i, beforeHandler, e) {
        let el = this as HTMLElement;
        let content = el.nextElementSibling as HTMLElement;
        let td = el.nextElementSibling.firstChild as HTMLElement;
        if (td.innerText == '') {
            td.appendChild(PageGridBuilder.loadContent(columnContents, i, record));
        }
        if (el.classList.contains(ClassName.Show)) {
            content.classList.remove(ClassName.Show);
            el.classList.remove(ClassName.Show);
        } else {
            content.classList.add(ClassName.Show);
            el.classList.add(ClassName.Show);
        }
    }
}
