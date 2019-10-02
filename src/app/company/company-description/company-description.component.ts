import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CompanyFortune } from 'ts/data/entity/entity';
import { CompanyFortuneService } from 'ts/service/company-fortune-service';

@Component({
  selector: 'app-company-description',
  templateUrl: './company-description.component.html',
  styleUrls: ['./company-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyDescriptionComponent {
  public fortunes: CompanyFortune[] = CompanyFortuneService.getFortunes();
  constructor() { }
}
