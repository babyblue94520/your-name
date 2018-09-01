import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';


@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  @ViewChild('all')
  public templateRef: TemplateRef<any>;
  @ViewChild('content')
  public contentRef: TemplateRef<any>;
  @ViewChild('label')
  public labelRef: TemplateRef<any>;

  @Input() id = '';
  @Input() label = '';
  @Input() disabled = false;
  @Input() active = false;

  @Input() onActive: Function;

  @Input() onClose: Function;

  constructor() {
  }
}
