import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Delay } from '@cui/core';
import { NameFortune } from 'ts/data/entity/entity';
import { NameFortuneService } from 'ts/service/name-fortune-service';
import { WordService } from 'ts/service/word-service';

@Component({
  selector: 'app-name-find',
  templateUrl: './name-find.component.html',
  styleUrls: ['./name-find.component.scss']
})
export class NameFindComponent {
  public numbers = [];
  public firstName: string = '吳';
  public lastName: string = '';
  public fortunes: NameFortune[];
  public currentFortune: NameFortune;

  constructor(private cdf: ChangeDetectorRef) {
    this.findFortunes();
  }


  @Delay(1000)
  public delayFindFortunes() {
    this.findFortunes();
  }

  public findFortunes() {
    this.cdf.markForCheck();
    if (!this.firstName) {
      this.fortunes = undefined;
      this.currentFortune = undefined;
      this.numbers[0] = 0;
      return;
    }
    WordService.find(this.firstName, (result) => {
      if (!result.success) {
        alert(result.message);
      }
      let count;
      let ws = result.data;
      if (ws.length > 1) {
        // 複數姓
        if (!ws[0]) {
          alert(this.firstName[0] + ' 找不到');
        }
        if (!ws[1]) {
          alert(this.firstName[1] + ' 找不到');
        }
        count = ws[0].num + ws[1].num;
      } else {
        //單數姓
        if (!ws[0]) {
          alert(this.firstName[0] + ' 找不到');
        }
        count = 1 + ws[0].num;
      }
      this.numbers[0] = count;
      //
      NameFortuneService.findByNum(count, (result) => {
        console.log(result);
        if (result.success) {
          this.fortunes = result.data;
        } else {
          alert(result.message);
        }
      })
    });
  }

  public selectedFortune(fortune: NameFortune) {
    this.currentFortune = fortune;
    let one = Number(fortune.num[1]);
    let two = Number(fortune.num[2]);
    let first = this.numbers[0];
    let ones = [], twos = [], c;
    for (let i = 1; i < 31; i++) {
      c = (i + first) % 10;
      if (c == one) {
        ones.push(i);
      } else if (c == two) {
        twos.push(i);
      }
    }
    console.log(ones, twos);
  }
}
