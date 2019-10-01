import * as moment from 'moment';
import { CUI } from '../cui';

enum ClassName {
    Datepicker = 'cui-datepicker',
    Screen = 'cui-datepicker-screen',
    Window = 'cui-datepicker-window',
    Header = 'cui-datepicker-header',
    HeaderText1 = 'cui-datepicker-header-text-1',
    HeaderText2 = 'cui-datepicker-header-text-2',
    Content = 'cui-datepicker-content',
    YearBlock = 'cui-datepicker-year-block',
    MonthBlock = 'cui-datepicker-month-block',
    DayBlock = 'cui-datepicker-day-block',
    DayYearMonth = 'cui-datepicker-day-yearmonth',
    DayYearMonthText = 'cui-datepicker-day-yearmonth-text',
    DayYearMonthPrev = 'cui-datepicker-day-yearmonth-prev',
    DayYearMonthNext = 'cui-datepicker-day-yearmonth-next',
    DayWeek = 'cui-datepicker-day-week',
    DayDays = 'cui-datepicker-day-days',
    DateItem = 'cui-datepicker-date-item',
    Footer = 'cui-datepicker-footer',
    Buttons = 'cui-datepicker-buttons',
    Button = 'cui-datepicker-button',
    SubmitButton = 'cui-datepicker-button submit',
    CancelButton = 'cui-datepicker-button cancel',
    BackButton = 'cui-datepicker-button back',
    Active = 'active',
    Show = 'show',
    ShowDatePicker = 'show-datepicker',
    Time = 'cui-datepicker-time',
    Colon = 'cui-datepicker-colon',
}


enum ActiveType {
    Year,
    Month,
    Day
}

/**
 * Date UI 選擇
 */
export enum PickerType {
    YM = 'YM', // 只顯示 年月選擇
    YMD = 'YMD', // 只顯示年月日選擇
    YMDHms = 'YMDHms'
}

/**
 * 日期選擇器
 */
export class DatePicker {
    private _datepickerElement: HTMLDivElement;
    private _screenElement: HTMLDivElement;
    private _windowElement: HTMLDivElement;
    private _headerElement: HTMLDivElement;
    private _yearBlockElement: HTMLDivElement;
    private _monthBlockElement: HTMLDivElement;
    private _dayBlockElement: HTMLDivElement;
    private _dayYearMonthTextElement: HTMLDivElement;
    private _dayYearMonthPrevElement: HTMLDivElement;
    private _dayYearMonthNextElement: HTMLDivElement;
    private _headerTextElement1: HTMLDivElement;
    private _headerTextElement2: HTMLDivElement;
    private _buttonsElement: HTMLDivElement;

    private _yearDivElements: HTMLDivElement[];
    private _monthDivElements: HTMLDivElement[];
    private _daySpanElements: HTMLSpanElement[];

    private _timeDivElement: HTMLDivElement;
    private _timeInput: HTMLInputElement;

    private _submitElement: HTMLButtonElement;
    private _cancelElement: HTMLButtonElement;
    private _backElement: HTMLButtonElement;

    private _minYear = 1911;
    private _maxYear = 2099;

    private _dateTime: moment.Moment;
    private _currentInputElement: HTMLInputElement;
    private _currentFormat: string;
    private _currentPickerType: PickerType;

    private _dateText = {
        month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        week: ['日', '一', '二', '三', '四', '五', '六']
    };

    constructor() {
    }


    private init() {
        if (this._datepickerElement) {
            return;
        }
        // 整個element
        this._datepickerElement = document.createElement('div');
        this._datepickerElement.className = ClassName.Datepicker;
        // 背景布幕
        this._screenElement = document.createElement('div');
        this._screenElement.className = ClassName.Screen;
        this._screenElement.addEventListener('click', this.close);
        // 日期選擇視窗
        this._windowElement = document.createElement('div');
        this._windowElement.className = ClassName.Window;
        // 視窗表頭
        let headerElement = document.createElement('div');
        headerElement.className = ClassName.Header;
        this._headerTextElement1 = document.createElement('div');
        this._headerTextElement1.className = ClassName.HeaderText1;

        this._headerTextElement2 = document.createElement('div');
        this._headerTextElement2.className = ClassName.HeaderText2;
        this._headerTextElement2.addEventListener('click', this.activeYear.bind(this));

        headerElement.appendChild(this._headerTextElement1);
        headerElement.appendChild(this._headerTextElement2);

        // 視窗內容
        let contentElement = document.createElement('div');
        contentElement.className = ClassName.Content;
        this.initYearBlock(contentElement);
        this.initMonthBlock(contentElement);
        this.initDayBlock(contentElement);

        // 視窗表尾
        let footerElement = document.createElement('div');
        footerElement.className = ClassName.Footer;
        this._buttonsElement = document.createElement('div');
        this._buttonsElement.className = ClassName.Buttons;
        this._submitElement = document.createElement('button');
        this._submitElement.className = ClassName.SubmitButton;
        this._submitElement.innerHTML = '確認';
        this._submitElement.addEventListener('click', this.submit);
        this._cancelElement = document.createElement('button');
        this._cancelElement.className = ClassName.CancelButton;
        this._cancelElement.innerHTML = '取消';
        this._cancelElement.addEventListener('click', this.close);
        this._backElement = document.createElement('button');
        this._backElement.className = ClassName.BackButton;
        this._backElement.innerHTML = '返回';
        this._backElement.addEventListener('click', this.back);

        this._buttonsElement.appendChild(this._submitElement);
        this._buttonsElement.appendChild(this._cancelElement);
        this._buttonsElement.appendChild(this._backElement);
        footerElement.appendChild(this._buttonsElement);

        this._windowElement.appendChild(headerElement);
        this._windowElement.appendChild(contentElement);
        this._windowElement.appendChild(footerElement);

        this._datepickerElement.appendChild(this._screenElement);
        this._datepickerElement.appendChild(this._windowElement);
        document.body.appendChild(this._datepickerElement);

        // 視窗改變時，去變更top位置
        window.addEventListener('resize', this.resizeHandler);
    }

    private initYearBlock(contentElement) {
        this._yearBlockElement = document.createElement('div');
        this._yearBlockElement.className = ClassName.YearBlock;
        let yearDivElement = document.createElement('div');

        // 生成月選單
        this._yearDivElements = [];
        let divElement: HTMLDivElement;
        for (let i = this._minYear; i < this._maxYear; i++) {
            divElement = document.createElement('div');
            divElement.innerHTML = String(i);
            divElement.addEventListener('click', this.changeYear.bind(this, i));
            yearDivElement.appendChild(divElement);
            this._yearDivElements.push(divElement);
        }
        this._yearBlockElement.appendChild(yearDivElement);
        contentElement.appendChild(this._yearBlockElement);
    }

    private initMonthBlock(contentElement) {
        this._monthBlockElement = document.createElement('div');
        this._monthBlockElement.className = ClassName.MonthBlock;
        let monthDivElement = document.createElement('div');

        // 生成月選單
        this._monthDivElements = [];
        let divElement: HTMLDivElement;
        for (let i = 0; i < 12; i++) {
            divElement = document.createElement('div');
            divElement.innerHTML = this._dateText.month[i];
            divElement.addEventListener('click', this.changeMonth2.bind(this, i));
            monthDivElement.appendChild(divElement);
            this._monthDivElements.push(divElement);
        }
        this._monthBlockElement.appendChild(monthDivElement);
        contentElement.appendChild(this._monthBlockElement);
    }

    /**
     *
     */
    private initDayBlock(contentElement) {
        // 日期區塊
        this._dayBlockElement = document.createElement('div');
        this._dayBlockElement.className = ClassName.DayBlock;
        // 月份快速左右移動
        let yearMonthElement = document.createElement('div');
        yearMonthElement.className = ClassName.DayYearMonth;
        this._dayYearMonthTextElement = document.createElement('div');
        this._dayYearMonthTextElement.className = ClassName.DayYearMonthText;
        // 上個月
        this._dayYearMonthPrevElement = document.createElement('div');
        this._dayYearMonthPrevElement.className = ClassName.DayYearMonthPrev;
        this._dayYearMonthPrevElement.innerHTML = '<div></div>';
        this._dayYearMonthPrevElement.addEventListener('click', this.changeMonth.bind(this, -1));
        // 下個月
        this._dayYearMonthNextElement = document.createElement('div');
        this._dayYearMonthNextElement.className = ClassName.DayYearMonthNext;
        this._dayYearMonthNextElement.innerHTML = '<div></div>';
        this._dayYearMonthNextElement.addEventListener('click', this.changeMonth.bind(this, 1));

        yearMonthElement.appendChild(this._dayYearMonthTextElement);
        yearMonthElement.appendChild(this._dayYearMonthPrevElement);
        yearMonthElement.appendChild(this._dayYearMonthNextElement);
        // 生成 星期選單
        let weekElement = document.createElement('div');
        weekElement.className = ClassName.DayWeek;
        let week = this._dateText.week;
        let weekHtmls = [];
        for (let i = 0, len = week.length; i < len; i++) {
            weekHtmls.push('<div class="' + ClassName.DateItem + '"><span>' + week[i] + '</span></div>');
        }
        weekElement.innerHTML = weekHtmls.join('');
        // 生成 日期選單
        let daysElement = document.createElement('div');
        daysElement.className = ClassName.DayDays;
        let day: HTMLDivElement, span: HTMLSpanElement;
        this._daySpanElements = [];
        for (let i = 0; i < 42; i++) {
            day = document.createElement('div');
            span = document.createElement('span');
            day.className = ClassName.DateItem;
            day.addEventListener('click', this.changeDay.bind(this, span));
            day.appendChild(span);
            daysElement.appendChild(day);
            this._daySpanElements.push(span);
        }
        // 時間輸入
        this._timeDivElement = document.createElement('div');
        this._timeDivElement.className = ClassName.Time;
        this._timeInput = document.createElement('input');
        this.initTimeInputEvent();
        let firstTimeButton = document.createElement('button');
        firstTimeButton.className = ClassName.Button;
        firstTimeButton.innerText = 'first';
        let currentTimeButton = document.createElement('button');
        currentTimeButton.className = ClassName.Button;
        currentTimeButton.innerText = 'now';
        let lastTimeButton = document.createElement('button');
        lastTimeButton.className = ClassName.Button;
        lastTimeButton.innerText = 'last';
        firstTimeButton.addEventListener('click', this.firstTime);
        currentTimeButton.addEventListener('click', this.nowTime);
        lastTimeButton.addEventListener('click', this.lastTime);
        this._timeDivElement.appendChild(this._timeInput);
        this._timeDivElement.appendChild(firstTimeButton);
        this._timeDivElement.appendChild(currentTimeButton);
        this._timeDivElement.appendChild(lastTimeButton);

        this._dayBlockElement.appendChild(yearMonthElement);
        this._dayBlockElement.appendChild(weekElement);
        this._dayBlockElement.appendChild(daysElement);
        this._dayBlockElement.appendChild(this._timeDivElement);
        contentElement.appendChild(this._dayBlockElement);
    }

    /**
     * 選擇最小時間
     */
    private firstTime = () => {
        this._dateTime.hour(0);
        this._dateTime.minute(0);
        this._dateTime.second(0);
        this._timeInput.value = this._dateTime.format('HH:mm:ss');
    }

    /**
     * 當前時間
     */
    private nowTime = () => {
        let now: moment.Moment = moment();
        this._dateTime.hour(now.hour());
        this._dateTime.minute(now.minute());
        this._dateTime.second(now.second());
        this._timeInput.value = this._dateTime.format('HH:mm:ss');
    }

    /**
     * 選擇最大時間
     */
    private lastTime = () => {
        this._dateTime.hour(23);
        this._dateTime.minute(59);
        this._dateTime.second(59);
        this._timeInput.value = this._dateTime.format('HH:mm:ss');
    }

    /**
     * init time input event
     */
    private initTimeInputEvent() {
        this._timeInput.addEventListener('click', this.timeInputOnClick);
        this._timeInput.addEventListener('click', this.timeInputOnClick);
        this._timeInput.addEventListener('mousemove', this.timeInputOnMove);
        this._timeInput.onkeydown = this.timeInputOnKeydown;
        this._timeInput.addEventListener('blur', this.timeInputOnBlur);
    }

    /**
     * time input move handler
     */
    private timeInputOnMove = (e) => {
        e.preventDefault();
    }

    /**
     * time input click handler
     */
    private timeInputOnClick = (e) => {
        let end = this._timeInput.value.indexOf(':', this._timeInput.selectionEnd);
        let start = this._timeInput.value.lastIndexOf(':', this._timeInput.selectionEnd);
        start = start == -1 ? 0 : start + 1;
        this._timeInput.setSelectionRange(start, end);
    }

    /**
     * time input key down handler
     */
    private timeInputOnKeydown = (e) => {
        if (e.ctrlKey) {
            if (e.keyCode == 67 || e.keyCode == 86) {
                return true;
            }
        }
        if (e.keyCode == 8) {
            return true;
        }
        return /\d/.test(e.key);
    }

    /**
     * time input blur handler
     */
    private timeInputOnBlur = (e) => {
        let values = this._timeInput.value.split(':');
        this._dateTime.hour(this.parseTime(values[0], 23));
        this._dateTime.minute(this.parseTime(values[1], 59));
        this._dateTime.second(this.parseTime(values[2], 59));
        this._timeInput.value = this._dateTime.format('HH:mm:ss');
    }

    /**
     * 解析時間
     * @param value
     * @param max
     */
    private parseTime(value: string, max: number): number {
        let v = Number((value || '0').substring(0, 2));
        if (isNaN(v)) {
            v = 0;
        } else if (v > max) {
            v = max;
        }
        return v;
    }

    /**
     * 打開日期套件
     * @param {jquery element object} $element
     */
    public open = (element: HTMLInputElement, format: string, pickerType: PickerType) => {
        if (!element || element.tagName != 'INPUT') { return; }

        this.init();
        this._datepickerElement.style.display = 'block';
        this._currentInputElement = element;
        this._currentFormat = format;
        this._currentPickerType = pickerType;

        if (!this.setValue(this._currentInputElement.value)) { return; }

        if (this._currentPickerType == PickerType.YMDHms) {
            this.activeDay();
            this._timeDivElement.style.display = 'block';
        } else if (this._currentPickerType == PickerType.YMD) {
            this.activeDay();
        } else if (this._currentPickerType == PickerType.YM) {
            this.activeMonth();
        }

        if (this._windowElement.offsetHeight > document.body.offsetHeight) {
            this._windowElement.classList.add('top');
        } else {
            this._windowElement.classList.remove('top');
        }
        this.resizeHandler();
        setTimeout(this.delayShow, 10);
    }

    /**
     * 視窗大小改變時，處理
     */
    private resizeHandler = () => {
        let windowHeight = window.innerHeight;
        let elHeight = this._windowElement.offsetHeight;
        let top = (windowHeight > elHeight ? windowHeight - elHeight : 30) / 2;
        let translateTop = Math.round(elHeight / 2);
        let elWidth = this._windowElement.offsetWidth;
        let translateLeft = Math.round(elWidth / 2);
        if (top < 20) {
            this._windowElement.classList.add('top');
            translateTop = 0;
        } else {
            this._windowElement.classList.remove('top');
        }
        CUI.style(this._windowElement, 'transform', 'translate(-' + translateLeft + 'px,-' + translateTop + 'px)');
    }

    private delayShow = () => {
        document.documentElement.classList.add(ClassName.ShowDatePicker);
        document.body.classList.add(ClassName.ShowDatePicker);
        this._datepickerElement.classList.add(ClassName.Show);
    }

    /**
     * 關閉日期套件
     */
    public close = () => {
        if (this._datepickerElement) {
            document.documentElement.classList.remove(ClassName.ShowDatePicker);
            document.body.classList.remove(ClassName.ShowDatePicker);
            this._datepickerElement.classList.remove(ClassName.Show);
            setTimeout(this.delayHide, 300);
        }
    }

    private delayHide = () => {
        this._datepickerElement.style.display = 'none';
    }

    /**
     * 將日期寫回input
     */
    private submit = () => {
        this._currentInputElement.value = this.getValue();
        let changeEvent = document.createEvent('HTMLEvents');
        changeEvent.initEvent('change', false, true);
        this._currentInputElement.dispatchEvent(changeEvent);
        let inputEvent = document.createEvent('HTMLEvents');
        inputEvent.initEvent('input', false, true);
        this._currentInputElement.dispatchEvent(inputEvent);
        this.close();
    }

    /**
     * 返回
     */
    private back = () => {
        if (this._currentPickerType == PickerType.YMDHms
            || this._currentPickerType == PickerType.YMD) {
            this.activeDay();
        } else if (this._currentPickerType == PickerType.YM) {
            this.activeMonth();
        }
    }

    /**
     * 變更年
     * @param {object} e
     */
    private changeYear(year: number, e) {
        this._dateTime.year(year);
        if (this._currentPickerType == PickerType.YMDHms
            || this._currentPickerType == PickerType.YMD) {
            this.restDayView();
            this.activeDay();
        } else if (this._currentPickerType == PickerType.YM) {
            this.activeMonth();
        }
    }

    /**
     * 變更月
     *
     * @param {int} i
     */
    private changeMonth(i) {
        this._dateTime.month(this._dateTime.month() + i);
        this.restDayView();
        this.changeDay();
    }

    /**
     * 變更月2
     * @param {object} e
     */
    private changeMonth2(month?: number) {
        if (month) {
            this._dateTime.month(month);
        }

        let active: HTMLDivElement;
        let element: HTMLDivElement;
        month = this._dateTime.month();
        for (let i = 0; i < 12; i++) {
            element = this._monthDivElements[i];
            if (i == month) {
                active = element;
                active.classList.add(ClassName.Active);
            } else {
                element.classList.remove(ClassName.Active);
            }
        }

        this._headerTextElement1.innerHTML = this._dateText.month[month];
        this._headerTextElement2.innerHTML = String(this._dateTime.year());
    }

    /**
     * 變更日
     * @param {object} e
     */
    private changeDay(span?: HTMLSpanElement) {
        if (span) {
            this._dateTime.date(Number(span.innerText));
        }
        let date = this._dateTime.date() + this._dateTime.clone().date(1).weekday() - 1;
        for (let i = 0; i < 42; i++) {
            if (date == i) {
                this._daySpanElements[i].parentElement.classList.add(ClassName.Active);
            } else {
                this._daySpanElements[i].parentElement.classList.remove(ClassName.Active);
            }
        }
        this._headerTextElement1.innerHTML = '<span>' + (this._dateTime.month() + 1) + '月</span> ' + this._dateTime.date() + ' <span>日</span> <span>星期' + this._dateText.week[this._dateTime.weekday()] + '</span>';
        this._headerTextElement2.innerHTML = String(this._dateTime.year());
    }


    /**
     * 設定日期
     * @param {string} dateStr
     */
    private setValue(dateStr) {
        if (!dateStr) {
            this._dateTime = moment();
        } else {
            this._dateTime = moment(dateStr);
        }
        this._timeInput.value = this._dateTime.format('HH:mm:ss');
        this.restDayView();
        return true;
    }

    /**
     * 取得{YYYY-MM-DD}字串日期
     */
    private getValue() {
        return this._dateTime.format(this._currentFormat);
    }


    /**
     * 刷新日期
     */
    private restDayView() {
        // 總日數
        let dayTotal = this._dateTime.daysInMonth();
        // 開始星期
        let startWeek = this._dateTime.clone().date(1).weekday();

        let d = 1;
        // 日
        for (let i = 0; i < 42; i++) {
            this._daySpanElements[i].parentElement.classList.remove('day');
            if (i < startWeek || d > dayTotal) {
                this._daySpanElements[i].innerText = '';
            } else {
                this._daySpanElements[i].innerText = String(d++);
                this._daySpanElements[i].parentElement.classList.add('day');
            }
        }
        this._dayYearMonthTextElement.innerHTML = '<span>' + this._dateText.month[this._dateTime.month()] + '</span> ' + this._dateTime.year();
    }


    /**
     * 標記年
     */
    private activeYear() {
        if (this._yearBlockElement.classList.contains(ClassName.Active)) {
            return;
        }
        this._yearBlockElement.style.display = 'block';
        if (this._dayBlockElement.offsetHeight && this._dayBlockElement.offsetHeight != this._yearBlockElement.offsetHeight) {
            this._yearBlockElement.style.height = this._dayBlockElement.offsetHeight + 'px';
        } else if (this._monthBlockElement.offsetHeight && this._monthBlockElement.offsetHeight != this._yearBlockElement.offsetHeight) {
            this._yearBlockElement.style.height = this._monthBlockElement.offsetHeight + 'px';
        }

        let active: HTMLDivElement;
        let element: HTMLDivElement;
        let year = this._dateTime.year();
        for (let i in this._yearDivElements) {
            element = this._yearDivElements[i];
            if (Number(element.innerText) == year) {
                active = element;
                active.classList.add(ClassName.Active);
            } else {
                element.classList.remove(ClassName.Active);
            }
        }
        this.closeBlock(ActiveType.Year);
        this._yearBlockElement.scrollTop = 0;
        this._yearBlockElement.scrollTop = active.offsetTop - (active.offsetHeight * 2);

        setTimeout(this.activeBlock.bind(this, ActiveType.Year), 0);
    }

    /**
     * 標記月
     */
    private activeMonth() {
        if (!this._monthBlockElement.classList.contains(ClassName.Active)) {
            this._monthBlockElement.style.display = 'block';
            this.closeBlock(ActiveType.Month);
        }

        this.changeMonth2();
        let active = this._monthDivElements[this._dateTime.month()];
        this._monthBlockElement.scrollTop = 0;
        this._monthBlockElement.scrollTop = active.offsetTop - (active.offsetHeight * 2);

        setTimeout(this.activeBlock.bind(this, ActiveType.Month), 0);
    }


    /**
     * 標記日期
     */
    private activeDay() {
        if (!this._dayBlockElement.classList.contains(ClassName.Active)) {
            this._dayBlockElement.style.display = 'block';
            this.closeBlock(ActiveType.Day);
        }

        this.changeDay();

        setTimeout(this.activeBlock.bind(this, ActiveType.Day), 0);
    }


    /**
     * 切換分頁
     * @param {string} type
     */
    private closeBlock = (type: ActiveType) => {
        if (ActiveType.Year == type) {
            this._monthBlockElement.classList.remove(ClassName.Active);
            this._monthBlockElement.style.display = 'none';
            this._dayBlockElement.classList.remove(ClassName.Active);
            this._dayBlockElement.style.display = 'none';
        } else if (ActiveType.Month == type) {
            this._yearBlockElement.classList.remove(ClassName.Active);
            this._yearBlockElement.style.display = 'none';
            this._dayBlockElement.classList.remove(ClassName.Active);
            this._dayBlockElement.style.display = 'none';
        } else if (ActiveType.Day == type) {
            this._yearBlockElement.classList.remove(ClassName.Active);
            this._yearBlockElement.style.display = 'none';
            this._monthBlockElement.classList.remove(ClassName.Active);
            this._monthBlockElement.style.display = 'none';
        }
    }

    /**
     * 切換分頁
     * @param {string} type
     */
    private activeBlock = (type: ActiveType) => {
        if (ActiveType.Year == type) {
            this._yearBlockElement.classList.add(ClassName.Active);
            this._submitElement.style.display = 'none';
            this._cancelElement.style.display = 'none';
            this._backElement.style.display = 'inline-block';
        } else if (ActiveType.Month == type) {
            this._monthBlockElement.classList.add(ClassName.Active);
            this._submitElement.style.display = 'inline-block';
            this._cancelElement.style.display = 'inline-block';
            this._backElement.style.display = 'none';
        } else if (ActiveType.Day == type) {
            this._dayBlockElement.classList.add(ClassName.Active);
            this._submitElement.style.display = 'inline-block';
            this._cancelElement.style.display = 'inline-block';
            this._backElement.style.display = 'none';
        }
    }
}
