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
import { AuthRoute } from 'ts/data/entity/entity';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';


interface RouteMap {
  [key: number]: AuthRoute;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent extends BasicComponent implements AfterViewInit {

  private menuElement: HTMLElement;
  private menuScreenElement: HTMLElement;

  @Cache.local('Menu', true)
  private isShow: boolean;
  private timer;
  private bodyClassName = 'open-menu';
  private openClassName = 'open';

  @Cache.session('Menu', MenuRoutes)
  public routes: RouteMap;
  public roots = [];
  public childs = {};
  @ViewChild('menu')
  public menuRef: ElementRef;
  @ViewChild('menuScreen')
  public menuScreenRef: ElementRef;

  constructor(private cdf: ChangeDetectorRef, private router: Router) {
    super();
    // 路由切換
    router.events.subscribe((e: RouterEvent) => {
      if (e instanceof NavigationEnd) {
        if (window.innerWidth < 996) {
          this.close();
          this.cdf.markForCheck();
        }
      }
    });
    this.initRoutes(MenuRoutes);
  }

  ngAfterViewInit() {
    this.menuElement = this.menuRef.nativeElement as HTMLElement;
    this.menuScreenElement = this.menuScreenRef.nativeElement as HTMLElement;
    CUI.addElementContentChangeEvent(this.menuElement, this.resize);
    this.menuElement.addEventListener('click', this.resize);
    this.menuScreenElement.addEventListener('click', this.close);

    // 不做動畫
    if (this.isShow == true) {
      document.documentElement.classList.add(this.bodyClassName);
      document.body.classList.add(this.bodyClassName);
      this.menuElement.style.display = 'block';
      this.menuScreenElement.style.display = 'block';
      this.menuElement.classList.add(this.openClassName);
      this.menuScreenElement.classList.add(this.openClassName);
      this.menuElement.style.left = '0px';
      MainMenuWidthNode.set(this.menuElement.offsetWidth);
    } else {
      document.documentElement.classList.remove(this.bodyClassName);
      document.body.classList.remove(this.bodyClassName);
      this.menuElement.classList.remove(this.openClassName);
      this.menuScreenElement.classList.remove(this.openClassName);
      this.menuElement.style.left = (this.menuElement.offsetWidth * -1) + 'px';
      MainMenuWidthNode.set(0);
      this.menuElement.style.display = 'none';
      this.menuScreenElement.style.display = 'none';
    }
  }

  public initRoutes(routes) {
    let oldRoutes = this.routes;
    this.routes = {};
    this.roots = [];
    this.childs = {};
    let route: AuthRoute;
    let old: AuthRoute;
    let parentId;
    for (let i in routes) {
      route = routes[i];
      this.routes[route.id] = route;
      old = oldRoutes[route.id];
      parentId = route.parentId;
      route.active = old ? old.active : false;
      if (parentId != 0) {
        if (!this.childs[parentId]) {
          this.childs[parentId] = [];
        }
        this.childs[parentId].push(route);
      } else {
        this.roots.push(route);
      }
    }
  }

  /**
   * 刷新寬度
   */
  private resize = (e) => {
    if (this.isShow) {
      MainMenuWidthNode.set(this.menuElement.offsetWidth);
    } else {
      MainMenuWidthNode.set(0);
      this.menuElement.style.left = (this.menuElement.offsetWidth * -1) + 'px';
    }
  }


  /**
   * 開啟或關閉
   */
  public openOrClose = () => {
    if (this.isShow) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * 開啟
   */
  public open = () => {
    if (this.isShow) {
      return;
    }
    this.isShow = true;
    document.documentElement.classList.add(this.bodyClassName);
    document.body.classList.add(this.bodyClassName);
    this.menuElement.style.display = 'block';
    this.menuScreenElement.style.display = 'block';
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.menuElement.style.left = (this.menuElement.offsetWidth * -1) + 'px';
      clearTimeout(this.timer);
      this.timer = this.doOpen();
    }, 0);
  }

  /**
   * 關閉
   */
  public close = () => {
    if (!this.isShow) {
      return;
    }
    this.isShow = false;
    document.documentElement.classList.remove(this.bodyClassName);
    document.body.classList.remove(this.bodyClassName);
    this.menuElement.classList.remove(this.openClassName);
    this.menuScreenElement.classList.remove(this.openClassName);
    this.menuElement.style.left = (this.menuElement.offsetWidth * -1) + 'px';
    MainMenuWidthNode.set(0);
    clearTimeout(this.timer);
    this.timer = this.doClose();
  }

  /**
   * 執行開啟
   */
  @Async(0)
  private doOpen() {
    this.menuElement.classList.add(this.openClassName);
    this.menuScreenElement.classList.add(this.openClassName);
    this.menuElement.style.left = '0px';
    MainMenuWidthNode.set(this.menuElement.offsetWidth);
  }

  /**
   * 執行關閉
   */
  @Async(300)
  private doClose() {
    this.menuElement.style.display = 'none';
    this.menuScreenElement.style.display = 'none';
  }
}
