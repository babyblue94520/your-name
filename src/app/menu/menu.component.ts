import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { AuthUserNode, MainMenuWidthNode } from 'ts/data/node/common';
import { BasicComponent } from '../../basic-component';
import { BasicService } from 'ts/service/core/basic-service';
import { Cache, CUI } from '@cui/core';

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
  public animationTime = 300;
  public routes;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
    this.listenNode(AuthUserNode, () => {
      let user = AuthUserNode.get();
      if (user) {
        this.routes = user.routes;
        this.changeDetectorRef.markForCheck();
      }
    }, true);
  }

  ngAfterViewInit() {
    this.menuElement = this.menuRef.nativeElement as HTMLElement;
    this.menuScreenElement = this.menuScreenRef.nativeElement as HTMLElement;
    CUI.addElementContentChangeEvent(this.menuElement, this.resize);
    this.menuElement.addEventListener('click', this.resize);
    this.menuScreenElement.addEventListener('click', this.close);
    if (this.isShow == true) {
      this.open();
    } else {
      this.close();
    }
  }

  public logout() {
    if (window.confirm('確定要登出系統?')) {
      BasicService.logout();
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
    clearTimeout(this.timer);
    this.menuElement.style.display = 'block';
    this.menuScreenElement.style.display = 'block';
    this.timer = setTimeout(() => {
      this.menuElement.style.left = (this.menuElement.offsetWidth * -1) + 'px';
      setTimeout(this.doOpen, 0);
    }, 0);
  }

  /**
   * 關閉
   */
  public close = () => {
    if (this.isOpen()) {
      document.documentElement.classList.remove(this.bodyClassName);
      document.body.classList.remove(this.bodyClassName);
      clearTimeout(this.timer);
      this.menuElement.classList.remove(this.openClassName);
      this.menuScreenElement.classList.remove(this.openClassName);
      this.timer = setTimeout(this.doClose, this.animationTime);
      this.menuElement.style.left = (this.menuElement.offsetWidth * -1) + 'px';
      MainMenuWidthNode.set(0);
    }
  }

  /**
   * 執行開啟
   */
  private doOpen = () => {
    this.menuElement.classList.add(this.openClassName);
    this.menuScreenElement.classList.add(this.openClassName);
    this.menuElement.style.left = '0px';
    MainMenuWidthNode.set(this.menuElement.offsetWidth);
    this.isShow = true;
  }

  /**
   * 執行關閉
   */
  private doClose = () => {
    this.menuElement.style.display = 'none';
    this.menuScreenElement.style.display = 'none';
    this.isShow = false;
  }
}
