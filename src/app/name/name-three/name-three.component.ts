import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NameFortune } from 'ts/data/entity/entity';
import { NameFortuneService } from 'ts/service/name-fortune-service';

@Component({
  selector: 'app-name-three',
  templateUrl: './name-three.component.html',
  styleUrls: ['./name-three.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NameThreeComponent {
  public fortunes: NameFortune[];

  constructor() {
    NameFortuneService.findAll({}, (result) => {
      console.log(result.data)
      this.fortunes = result.data;
    });
  }
}
