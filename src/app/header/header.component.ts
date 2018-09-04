import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CUI } from '@cui/core';
import { MainHeaderHeightNode, MainMenuWidthNode } from 'ts/data/node/common';
import { MenuComponent } from '../menu/menu.component';
import { BasicComponent } from 'app/basic-component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent extends BasicComponent implements AfterViewInit {

  private headerElement: HTMLElement;
  private headerSpaceElement: HTMLElement;
  private resizeDelayHandler: any;

  @ViewChild('header')
  public headerRef: ElementRef;
  @ViewChild('headerSpace')
  public headerSpaceRef: ElementRef;
  @ViewChild(MenuComponent)
  public menu: MenuComponent;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.headerElement = this.headerRef.nativeElement;
    this.headerSpaceElement = this.headerSpaceRef.nativeElement;
    this.resizeDelayHandler = CUI.delayAction.bind(this, 'main-header-resize', 300, this.resize);
    window.addEventListener('resize', this.resizeDelayHandler);
    document.body.addEventListener('keyup', this.focus);
    document.body.addEventListener('click', this.focus);

    CUI.addElementContentChangeEvent(this.headerElement, this.resizeDelayHandler);
    this.listenNode(MainMenuWidthNode, () => {
      this.headerElement.style.paddingLeft = MainMenuWidthNode.get() + 'px';
    }, true);

    this.resize();
  }

  /**
   * 刷新header占用空間的高度
   */
  private resize = () => {
    let h1 = this.headerSpaceElement.offsetHeight;
    let h2 = this.headerElement.offsetHeight;
    if (this.headerElement
      && h1 != h2) {
      this.headerSpaceElement.style.height = h2 + 'px';
      MainHeaderHeightNode.set(h2);
    }
  }

  /**
   * input or textarea focused 隱藏header
   */
  private focus = (e: Event) => {
    let element = document.activeElement as HTMLInputElement;
    if ((element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') && !element.readOnly && !element.disabled) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * 開啟選單
   */
  public openMenu = () => {
    this.menu.openOrClose();
  }

  public show() {
    this.headerElement.style.top = '';
  }

  public hide() {
    this.headerElement.style.top = '-100%';
  }
}
