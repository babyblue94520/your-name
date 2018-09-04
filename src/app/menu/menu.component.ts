import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { MainMenuWidthNode } from 'ts/data/node/common';
import { Cache, CUI, Async } from '@cui/core';
import { BasicComponent } from 'app/basic-component';
import { MenuRoutes } from 'ts/data/word/routes';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent extends BasicComponent implements AfterViewInit {
  @ViewChild('menu') menuRef: ElementRef;
  @ViewChild('menuScreen') menuScreenRef: ElementRef;
  private menuElement: HTMLElement;
  private menuScreenElement: HTMLElement;

  @Cache.local('Menu', true)
  private isShow: boolean;
  private timer;
  private bodyClassName = 'open-menu';
  private openClassName = 'open';
  public routes = MenuRoutes;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit() {
    this.menuElement = this.menuRef.nativeElement as HTMLElement;
    this.menuScreenElement = this.menuScreenRef.nativeElement as HTMLElement;
    CUI.addElementContentChangeEvent(this.menuElement, this.resize);
    this.menuElement.addEventListener('click', this.resize);
    this.menuScreenElement.addEventListener('click', this.close);
    if (this.isShow == true) {
      document.documentElement.classList.add(this.bodyClassName);
      document.body.classList.add(this.bodyClassName);
      this.menuElement.style.display = 'block';
      this.menuScreenElement.style.display = 'block';
      this.menuElement.classList.add(this.openClassName);
      this.menuScreenElement.classList.add(this.openClassName);
      this.menuElement.style.transform = 'translateX(0px)';
      this.menuElement.style.webkitTransform = '-webkit-translateX(0px)';
      MainMenuWidthNode.set(this.menuElement.offsetWidth);
    }
  }

  public isOpen = () => {
    return this.menuElement.classList.contains(this.openClassName);
  }

  /**
   * 刷新寬度
   */
  private resize = () => {
    MainMenuWidthNode.set(this.menuElement.offsetWidth);
    if (!this.isOpen()) {
      this.menuElement.style.left = (this.menuElement.offsetWidth * -1) + 'px';
    }
  }


  /**
   * 開啟或關閉
   */
  public openOrClose = () => {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * 開啟
   */
  public open = () => {
    if (this.isOpen()) {
      return;
    }
    document.documentElement.classList.add(this.bodyClassName);
    document.body.classList.add(this.bodyClassName);
    this.menuElement.style.display = 'block';
    this.menuScreenElement.style.display = 'block';
    clearTimeout(this.timer);
    this.timer = this.doOpen1();
  }

  /**
   * 關閉
   */
  public close = () => {
    if (this.isOpen()) {
      document.documentElement.classList.remove(this.bodyClassName);
      document.body.classList.remove(this.bodyClassName);
      this.menuElement.classList.remove(this.openClassName);
      this.menuScreenElement.classList.remove(this.openClassName);

      this.menuElement.style.transform = 'translateX(-' + this.menuElement.offsetWidth + 'px)';
      this.menuElement.style.webkitTransform = '-webkit-translateX(-' + this.menuElement.offsetWidth + 'px)';

      MainMenuWidthNode.set(0);
      clearTimeout(this.timer);
      this.timer = this.doClose();
    }
  }

  @Async(0)
  private doOpen1() {
    this.menuElement.style.transform = 'translateX(-' + this.menuElement.offsetWidth + 'px)';
    this.menuElement.style.webkitTransform = '-webkit-translateX(-' + this.menuElement.offsetWidth + 'px)';
    this.doOpen2();
  }

  /**
   * 執行開啟
   */
  @Async(0)
  private doOpen2() {
    this.menuElement.classList.add(this.openClassName);
    this.menuScreenElement.classList.add(this.openClassName);
    this.menuElement.style.transform = 'translateX(0px)';
    this.menuElement.style.webkitTransform = '-webkit-translateX(0px)';
    MainMenuWidthNode.set(this.menuElement.offsetWidth);
    this.isShow = true;
  }

  /**
   * 執行關閉
   */
  @Async(300)
  private doClose() {
    this.menuElement.style.display = 'none';
    this.menuScreenElement.style.display = 'none';
    this.isShow = false;
  }
}
