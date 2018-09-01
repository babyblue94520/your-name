import { CUI, Delay } from '@cui/core';
import { TabComponent } from '../tab/tab.component';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabGroupComponent implements AfterContentInit, AfterViewInit, AfterViewChecked {
  private header: HTMLElement;
  private hover: HTMLElement;
  private labels: HTMLElement;
  private contents: HTMLElement;
  private prev: HTMLElement;
  private next: HTMLElement;

  public currentIndex;
  private leftIndex = 0;
  private labelsLeft = 0;

  @ViewChildren('label')
  public labelRef: QueryList<ElementRef>;

  @ContentChildren(TabComponent)
  public tabsRef: QueryList<TabComponent>;

  @Input()
  set activeIndex(value: number) {
    this.active(value);
  }

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngAfterContentInit() {
    this.tabsRef.changes.subscribe(() => {
      this.changeDetectorRef.markForCheck();
      if (this.tabsRef.length) {
        this.initActive();
      } else {
        this.contentClear();
      }
    });
    this.initActive();
  }

  ngAfterViewInit() {
    this.labelRef.changes.subscribe(() => {
      this.changeDetectorRef.markForCheck();
      if (this.labelRef.length) {
        this.hoverBar();
        this.showPrevNext();
      } else {
        this.headerClear();
      }
    });

    let element: HTMLElement = this.elementRef.nativeElement;
    this.header = element.querySelector('.cui-tab-header');
    this.hover = element.querySelector('.cui-tab-header-hover');
    this.labels = element.querySelector('.cui-tab-labels');
    this.contents = element.querySelector('.cui-tab-contents');
    this.prev = element.querySelector('.cui-tab-prev');
    this.prev.addEventListener('click', this.prevClick);
    this.next = element.querySelector('.cui-tab-next');
    this.next.addEventListener('click', this.nextClick);

    window.addEventListener('resize', this.resize.bind(this));
    this.showPrevNext();
    this.hoverBar();
  }

  ngAfterViewChecked() {
    this.showPrevNext();
    this.hoverBar();
  }


  @Delay(300)
  private resize(e) {
    this.showPrevNext();
  }

  private headerClear() {
    if (this.labels) {
      this.labels.style.transform = '';
    }
    if (this.hover) {
      this.hover.style.width = '0px';
      this.hover.style.transform = '';
    }
  }

  private contentClear() {
    if (this.contents) {
      this.contents.style.transform = '';
    }
  }
  private initActive() {
    let index = 0;
    let nan = isNaN(this.currentIndex);
    if (nan || this.currentIndex > this.tabsRef.length) {
      index = nan ? 0 : (this.tabsRef.length - 1);
    }
    let tabs = this.tabsRef.toArray();
    let tab: TabComponent;
    for (let i = 0, l = tabs.length; i < l; i++) {
      tab = tabs[i];
      if (tab.active) {
        index = i;
      }
      tab.active = false;
    }
    this.active(index);
  }

  public active = (index: number) => {
    if (index < 0) { return; }
    if (!this.tabsRef) { return; }
    this.changeDetectorRef.markForCheck();
    let l = this.tabsRef.length;
    this.currentIndex = index % l;
    let tabs: TabComponent[] = this.tabsRef.toArray();
    for (let i = 0; i < l; i++) {
      if (i == this.currentIndex && tabs[i].disabled) {
        return;
      }
    }
    for (let i = 0; i < l; i++) {
      tabs[i].active = (i == this.currentIndex);
    }
    if (tabs[this.currentIndex]) {
      CUI.callFunction(tabs[this.currentIndex].onActive);
    }
    this.hoverBar();
  }

  private showPrevNext = () => {
    if (this.labels.offsetWidth > this.header.offsetWidth) {
      if (this.labelsLeft == 0) {
        this.prev.style.display = 'none';
      } else {
        this.prev.style.display = 'block';
      }
      if (this.header.offsetWidth + this.labelsLeft < this.labels.offsetWidth) {
        this.next.style.display = 'block';
      } else {
        this.next.style.display = 'none';
      }
    } else {
      this.prev.style.display = 'none';
      this.next.style.display = 'none';
    }
  }

  public prevClick = () => {
    if (this.leftIndex != 0) {
      let label: HTMLElement = this.labelRef.toArray()[--this.leftIndex].nativeElement;
      this.labelsLeft -= label.offsetWidth;
      this.labels.style.transform = 'translateX(-' + this.labelsLeft + 'px)';
      this.hoverBar();
    }
    this.showPrevNext();
  }

  public nextClick = () => {
    if (this.header.offsetWidth + this.labelsLeft < this.labels.offsetWidth) {
      let label: HTMLElement = this.labelRef.toArray()[this.leftIndex++].nativeElement;
      this.labelsLeft += label.offsetWidth;
      this.labels.style.transform = 'translateX(-' + this.labelsLeft + 'px)';
      this.hoverBar();
    }
    this.showPrevNext();
  }

  private hoverBar() {
    if (!this.labelRef) {
      return;
    }
    if (this.labelRef.length == 0) {
      if (this.hover) {
        this.hover.style.width = '0px';
      }
      return;
    }
    let labels = this.labelRef.toArray();
    let label: HTMLElement;
    let left = 0;
    for (let i = 0, l = labels.length; i < l; i++) {
      label = labels[i].nativeElement;
      if (i == this.currentIndex) {
        break;
      } else {
        left += label.offsetWidth;
      }
    }
    if (label) {
      this.contents.style.transform = 'translateX(-' + (this.currentIndex * 100) + '%)';
      this.hover.style.width = label.offsetWidth + 'px';
      this.hover.style.transform = 'translateX(' + (left - this.labelsLeft) + 'px)';
    }
  }
}
