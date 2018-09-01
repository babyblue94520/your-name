import {
  Directive,
  ElementRef,
  Input
} from '@angular/core';
import { AutoComplete, AutoCompleteConfig } from '@cui/core';

@Directive({
  selector: '[appAutoComplete]'
})
export class AutoCompleteDirective {
  private autoComplete: AutoComplete;
  private config: AutoCompleteConfig;

  constructor(private el: ElementRef) {

  }

  @Input() set appAutoComplete(config: AutoCompleteConfig) {
    this.config = config;
    if (!this.autoComplete) {
      let input: HTMLInputElement;
      if (this.el.nativeElement instanceof HTMLInputElement) {
        input = this.el.nativeElement;
      } else {
        input = this.el.nativeElement.querySelector('input');
      }
      if (input) {
        this.autoComplete = new AutoComplete(input, this.config);
      }
    }
    this.autoComplete.setConfig(config);
  }
}
