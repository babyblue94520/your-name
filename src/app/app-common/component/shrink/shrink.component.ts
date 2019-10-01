import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Async } from '@cui/core';

@Component({
  selector: 'app-shrink',
  templateUrl: './shrink.component.html',
  styleUrls: ['./shrink.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShrinkComponent implements AfterViewInit {
  private _isOpen = true;
  private timer;
  private shrink: HTMLElement;
  private header: HTMLElement;
  private content: HTMLElement;
  private closeIcon: HTMLElement;

  @ViewChild('header')
  public headerRef: TemplateRef<any>;
  @Input()
  public title = '';
  @ViewChild('shrink')
  public shrinkRef: ElementRef;
  @Input()
  public shadow: boolean = false;

  constructor() {

  }

  @Input() set isOpen(value: boolean) {
    this._isOpen = value;
  }

  ngAfterViewInit(): void {
    this.shrink = this.shrinkRef.nativeElement;
    this.header = this.shrink.children[0] as HTMLElement;
    this.content = this.shrink.children[1] as HTMLElement;
    this.closeIcon = this.header.children[0] as HTMLElement;
    this.header.style.height = this.getIconHeight() + 'px';
    if (this._isOpen) {
      this.shrink.style.height = 'auto';
      this.shrink.style.opacity = '1';
      this.header.classList.remove('close');
    } else {
      this.shrink.style.height = this.getIconHeight() + 'px';
      this.shrink.style.opacity = '.9';
      this.header.classList.add('close');
    }
  }

  public openOrClose() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open() {
    if (!this._isOpen) {
      this._isOpen = true;
      this.header.classList.remove('close');
      this.shrink.style.height = this.getAllHeight() + 'px';
      this.shrink.style.opacity = '1';
      clearTimeout(this.timer);
      this.timer = this.asyncHeightAuto();
    }
  }

  public close() {
    if (this._isOpen) {
      this._isOpen = false;
      this.header.classList.add('close');
      this.shrink.style.height = this.getAllHeight() + 'px';
      this.shrink.style.opacity = '.9';
      clearTimeout(this.timer);
      this.timer = this.asyncHeightZero();
    }
  }

  @Async(300)
  private asyncHeightAuto() {
    this.shrink.style.height = 'auto';
  }

  @Async(0)
  private asyncHeightZero() {
    this.shrink.style.height = this.getIconHeight() + 'px';
    this.header.style.height = this.getIconHeight() + 'px';
  }

  private getIconHeight() {
    return this.closeIcon.offsetHeight;
  }
  private getAllHeight() {
    return this.closeIcon.offsetHeight + this.content.offsetHeight;
  }

}
