import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NameNumFortune } from 'ts/data/entity/entity';
import { NameNumFortunes } from 'ts/data/word/name-fortunes';

@Component({
  selector: 'app-name-num',
  templateUrl: './name-num.component.html',
  styleUrls: ['./name-num.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NameNumComponent {
  public fortunes: NameNumFortune[] = NameNumFortunes;

  constructor() { }
}
