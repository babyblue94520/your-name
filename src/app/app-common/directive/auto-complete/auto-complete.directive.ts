import { AutoComplete, AutoCompleteConfig } from '@cui/core';
import {
  Directive,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[appAutoComplete]'
})
export class AutoCompleteDirective implements OnDestroy {
  private autoComplete: AutoComplete;

  constructor(private el: ElementRef) {
    let input;
    if (this.el.nativeElement instanceof HTMLInputElement) {
      input = this.el.nativeElement;
    } else {
      input = this.el.nativeElement.querySelector('input');
    }
    if (input) {
      this.autoComplete = new AutoComplete(input);
    }
  }

  @Input() set appAutoComplete(config: AutoCompleteConfig) {
    if (this.autoComplete) {
      this.autoComplete.setConfig(config);
    }
  }

  ngOnDestroy() {
    if (this.autoComplete) {
      this.autoComplete.destroy();
    }
  }
}
