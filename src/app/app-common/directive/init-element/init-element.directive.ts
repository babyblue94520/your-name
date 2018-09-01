import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appInitElement]'
})
export class InitElementDirective {
  private init = false;
  constructor(private el: ElementRef) {

  }

  @Input() set appInitElement(element: HTMLElement) {
    if (!this.init) {
      this.el.nativeElement.appendChild(element);
      this.init = true;
    }
  }
}
