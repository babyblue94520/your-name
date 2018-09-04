import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Fortune } from 'ts/data/entity/entity';
import { Fortunes } from 'ts/data/word/fortunes';

@Component({
  selector: 'app-company-description',
  templateUrl: './company-description.component.html',
  styleUrls: ['./company-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyDescriptionComponent {
  public fortunes: Fortune[] = Fortunes;
  constructor() { }
}
