import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BasicComponent } from '../basic-component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent extends BasicComponent {

  constructor() { super(); }
}
