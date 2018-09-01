import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { CUI } from '@cui/core';
import { MainFooterHeightNode, MainMenuWidthNode } from 'ts/data/node/common';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements AfterViewInit, OnDestroy {

  @ViewChild('footer') footerRef: ElementRef;
  @ViewChild('footerSpace') footerSpaceRef: ElementRef;

  private footerElement: HTMLElement;
  private footerSpaceElement: HTMLElement;
  private resizeDelayHandler: any;
  private menuWidthHandler;
  constructor() { }

  ngAfterViewInit() {
    this.footerElement = this.footerRef.nativeElement;
    this.footerSpaceElement = this.footerSpaceRef.nativeElement;
    this.resizeDelayHandler = CUI.delayAction.bind(this, 'main-footer-resize', 300, this.resize);
    this.resize();
    window.addEventListener('resize', this.resizeDelayHandler);
    CUI.addElementContentChangeEvent(this.footerElement, this.resizeDelayHandler);
    this.menuWidthHandler = MainMenuWidthNode.listen(() => {
      this.footerElement.style.paddingLeft = MainMenuWidthNode.get() + 'px';
    }, true);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeDelayHandler);
    CUI.removeElementContentChangeEvent(this.footerElement, this.resizeDelayHandler);
    MainMenuWidthNode.interrupt(this.menuWidthHandler);
  }

  private resize = () => {
    let h1 = this.footerSpaceElement.offsetHeight;
    let h2 = this.footerElement.offsetHeight;
    if (this.footerElement
      && h1 != h2) {
      this.footerSpaceElement.style.height = h2 + 'px';
      MainFooterHeightNode.set(h2);
    }
  }
}
