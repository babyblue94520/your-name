import { element } from 'protractor';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  AfterContentChecked,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldComponent implements AfterContentChecked, AfterViewInit {
  public element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

  public empty = '';

  public focus = '';

  @Input()
  public label: string;

  @Input()
  public message: string;

  @Input()
  public error: string;

  @Input()
  public class: string;

  constructor(private elementRef: ElementRef, private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.element = this.elementRef.nativeElement.querySelector('select,input,textarea');

    this.initEvent();
  }

  ngAfterContentChecked() {
    if (this.element) {
      this.isEmpty();
    }
  }

  private initEvent() {
    this.element.addEventListener('focus', () => {
      this.changeDetectorRef.markForCheck();
      this.focus = 'focus';
    });
    this.element.addEventListener('blur', () => {
      this.changeDetectorRef.markForCheck();
      this.focus = '';
    });
  }

  private isEmpty() {
    this.changeDetectorRef.markForCheck();
    this.empty = (this.element.value == undefined || this.element.value === '') ? '' : 'not-empty';
  }
}
