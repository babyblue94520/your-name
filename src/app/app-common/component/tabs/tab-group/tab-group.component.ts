import { Delay } from '@cui/core';
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
} from '@angular/core';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabGroupComponent implements AfterContentInit, AfterViewInit {
  private header: HTMLElement;
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
  public activeIndex = 0;

  constructor(
    private elementRef: ElementRef,
    private cdf: ChangeDetectorRef
  ) {
  }

  ngAfterContentInit() {
    this.tabsRef.changes.subscribe(() => {
      this.cdf.markForCheck();
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
      this.cdf.markForCheck();
      if (this.labelRef.length) {
        this.hoverBar();
        this.showPrevNext();
      } else {
        this.headerClear();
      }
    });

    let element: HTMLElement = this.elementRef.nativeElement;
    this.header = element.querySelector('.cui-tab-header');
    this.labels = element.querySelector('.cui-tab-labels');
    this.contents = element.querySelector('.cui-tab-contents');
    this.prev = element.querySelector('.cui-tab-prev');
    this.prev.addEventListener('click', this.prevClick.bind(this));
    this.next = element.querySelector('.cui-tab-next');
    this.next.addEventListener('click', this.nextClick.bind(this));

    window.addEventListener('resize', this.resize.bind(this));
    this.showPrevNext();
    this.delayAfterViewInit();
  }

  @Delay(300)
  private delayAfterViewInit() {
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
      index = nan ? this.activeIndex : (this.tabsRef.length - 1);
    } else {
      index = this.currentIndex;
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

  public active(index: number) {
    if (index < 0) { return; }
    if (!this.tabsRef) { return; }
    this.cdf.markForCheck();
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
      tabs[this.currentIndex].doActive();
    }
    this.hoverBar();
  }

  private showPrevNext() {
    if (this.labels) {
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
        this.labelsLeft = 0;
        this.labels.style.transform = 'translateX(0px)';
        this.hoverBar();
      }
    }
  }

  public prevClick() {
    if (this.leftIndex != 0) {
      let label: HTMLElement = this.labelRef.toArray()[--this.leftIndex].nativeElement;
      if (this.leftIndex == 0) {
        this.labelsLeft = 0;
      } else {
        this.labelsLeft -= label.offsetWidth;
      }
      this.labels.style.transform = 'translateX(-' + this.labelsLeft + 'px)';
      this.hoverBar();
    }
    this.showPrevNext();
  }

  public nextClick() {
    if (this.header.offsetWidth + this.labelsLeft < this.labels.offsetWidth && this.leftIndex < this.labelRef.length - 1) {
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
    let labels = this.labelRef.toArray();
    let label: HTMLElement;
    for (let i = 0, l = labels.length; i < l; i++) {
      label = labels[i].nativeElement;
      if (i == this.currentIndex) {
        break;
      }
    }
    if (label) {
      this.contents.style.transform = 'translateX(-' + (this.currentIndex * 100) + '%)';
    }
  }

}
