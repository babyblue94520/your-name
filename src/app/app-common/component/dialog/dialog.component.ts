import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef
} from '@angular/core';
import { BasicComponent } from '../../../basic-component';
import { CUI, Async } from '@cui/core';
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent extends BasicComponent implements OnInit, AfterViewInit, OnDestroy {
  private dialog: HTMLElement;
  private window: HTMLElement;
  private screen: HTMLElement;
  private toolbar: HTMLElement;
  private timer;
  private delayResize;
  public _windowClassName;

  private nativeElement: HTMLElement;
  private outlet: DomPortalOutlet;


  @ViewChild('dialog')
  public templateRef: TemplateRef<any>;

  @Input()
  set windowClassName(value: string) {
    this._windowClassName = value;
  }

  @Input()
  public title;

  @Input()
  public onClose: Function;

  @Input()
  public top: string;
  @Input()
  public height: string;
  @Input()
  public width: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  ngOnInit() {
    let appRef = this.injector.get<ApplicationRef>(ApplicationRef);

    let templatePortal = new TemplatePortal(
      this.templateRef,
      this.viewContainerRef
    );
    this.nativeElement = document.createElement('div');
    document.body.appendChild(this.nativeElement);

    this.outlet = new DomPortalOutlet(this.nativeElement, this.componentFactoryResolver, appRef, this.injector);
    this.outlet.attach(templatePortal);
  }

  ngAfterViewInit() {
    this.dialog = this.nativeElement.querySelector('.cui-dialog');
    this.screen = this.nativeElement.querySelector('.cui-dialog-screen');
    this.toolbar = this.nativeElement.querySelector('.cui-dialog-toolbar');
    this.window = this.dialog.querySelector('.cui-dialog-window');
    this.dialog.style.display = 'block';
    this.resize();
    this.dialog.style.display = 'none';
    this.delayResize = CUI.delayAction.bind(null, 'dialog-resize', 100, this.resize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.delayResize);
    this.outlet.dispose();
  }

  public open() {
    this.changeDetectorRef.markForCheck();
    this.screen.style.display = 'block';
    this.dialog.style.display = 'block';
    document.documentElement.classList.add('cui-show-dialog');
    document.body.classList.add('cui-show-dialog');
    this.resize();
    CUI.addElementContentChangeEvent(this.window, this.delayResize);
    window.addEventListener('resize', this.delayResize);
    clearTimeout(this.timer);
    this.timer = this.doOpen();
  }

  public close() {
    this.dialog.classList.remove('show');
    document.documentElement.classList.remove('cui-show-dialog');
    document.body.classList.remove('cui-show-dialog');
    CUI.removeElementContentChangeEvent(this.window, this.delayResize);
    window.removeEventListener('resize', this.delayResize);
    CUI.callFunction(this.onClose);
    clearTimeout(this.timer);
    this.timer = this.doClose();
  }

  @Async(0)
  private doOpen() {
    this.dialog.classList.add('show');
  }

  @Async(300)
  private doClose() {
    this.dialog.style.display = 'none';
    this.screen.style.display = 'none';
  }

  private resize = (e?) => {
    if (this.toolbar.childElementCount == 0) {
      this.toolbar.style.display = 'none';
    } else {
      this.toolbar.style.display = 'block';
    }
    this.window.style.marginBottom = (this.toolbar.offsetHeight + 10) + 'px';
    this.setCenter(this.window);
  }

  /**
   * 設定Element Translate置中
   * @param element
   */
  private setCenter(element: HTMLElement) {
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let height = element.offsetHeight;
    let width = element.offsetWidth;
    let top = '50%';
    let left = '50%';
    let translateTop = Math.round(height / 2);
    let translateLeft = Math.round(width / 2);
    if (width > winWidth) {
      left = '10px';
      translateLeft = 0;
    }
    if (height > winHeight) {
      top = '20px';
      translateTop = 0;
    }
    if (this.top != undefined) {
      top = this.top;
      translateTop = 0;
    }
    element.style.top = top;
    element.style.left = left;
    element.style.transform = 'translate(-' + translateLeft + 'px,-' + translateTop + 'px)';
    element.style.webkitTransform = '-webkit-translate(-' + translateLeft + 'px,-' + translateTop + 'px)';
  }

}
