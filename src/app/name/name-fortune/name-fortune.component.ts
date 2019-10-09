import { Component, ChangeDetectorRef } from '@angular/core';
import { Delay, Cache } from '@cui/core';
import { NameFortune, NameNumFortune, NameFortuneOther, NameFortuneSick } from 'ts/data/entity/entity';
import { NameNumFortunesMap, NameFortunesMap, NumTypes, NameFortuneBasicsMap, NameFortuneSuccessMap, NameFortuneSocialityMap, NameFortuneSickMap } from 'ts/service/name-fortune-service';
import { WordService } from 'ts/service/word-service';
import { Word } from 'ts/constant/word';

@Component({
  selector: 'app-name-fortune',
  templateUrl: './name-fortune.component.html',
  styleUrls: ['./name-fortune.component.scss']
})
export class NameFortuneComponent {
  public fiveType = ['木', '火', '土', '金', '水'];
  public nameFortune: NameNumFortune[] = [];
  @Cache.local('NameFortune', '')
  public firstName;
  @Cache.local('NameFortune', undefined)
  public firstNameWords: Word[] = [];
  @Cache.local('NameFortune', '')
  public lastName;
  @Cache.local('NameFortune', undefined)
  public lastNameWords: Word[] = [];
  @Cache.local('NameFortune', undefined)
  public currentFortune: NameFortune;
  @Cache.local('NameFortune', undefined)
  public currentFortuneBasic: NameFortuneOther;
  @Cache.local('NameFortune', undefined)
  public currentFortuneSuccess: NameFortuneOther;
  @Cache.local('NameFortune', undefined)
  public currentFortuneSociality: NameFortuneOther;
  @Cache.local('NameFortune', undefined)
  public currentFortuneSick: NameFortuneSick;

  constructor(private cdf: ChangeDetectorRef) {
    this.findFortunes();
  }

  @Delay(1000)
  public delayFindFortunes() {
    this.findFortunes();
  }

  /**
   * 搜尋3才配置
   */
  public findFortunes() {
    this.cdf.markForCheck();
    if (!this.firstName || !this.lastName) {
      this.currentFortune = undefined;
      this.currentFortuneBasic = undefined;
      this.currentFortuneSuccess = undefined;
      this.currentFortuneSociality = undefined;
      this.currentFortuneSick = undefined;
      this.nameFortune = [];
      return;
    }
    if (this.firstName.length > 2 || this.lastName.length > 2) {
      alert(this.firstName + '太長，最多兩個字');
      return;
    }
    WordService.find(this.firstName, (result) => {
      if (!result.success) {
        alert(result.message);
        return;
      }
      let count;
      let ws = result.data;
      this.firstNameWords = ws;
      if (ws.length > 1) {
        // 複數姓
        if (!ws[0]) {
          alert(this.firstName[0] + ' 找不到');
          return;
        }
        if (!ws[1]) {
          alert(this.firstName[1] + ' 找不到');
          return;
        }
        count = ws[0].num + ws[1].num;
      } else {
        // 單數姓
        if (!ws[0]) {
          alert(this.firstName[0] + ' 找不到');
          return;
        }
        count = 1 + ws[0].num;
      }
      // 天格
      this.nameFortune[0] = NameNumFortunesMap[count];
      this.findLastFortunes();
    });
  }

  private findLastFortunes() {
    WordService.find(this.lastName, (result) => {
      if (!result.success) {
        alert(result.message);
        return;
      }
      let ws = result.data;
      this.lastNameWords = ws;
      if (ws.length > 1) {
        if (!ws[0]) {
          alert(this.lastName[0] + ' 找不到');
          return;
        }
        if (!ws[1]) {
          alert(this.lastName[1] + ' 找不到');
          return;
        }
      } else {
        if (!ws[0]) {
          alert(this.lastName[0] + ' 找不到');
          return;
        }
      }
      let num = this.lastNameWords[0].num;
      let num2 = this.lastNameWords.length > 1 ? this.lastNameWords[1].num : 1;


      // 人格
      this.nameFortune[1] = NameNumFortunesMap[num + (this.firstName.length > 1 ? this.firstNameWords[1].num : this.firstNameWords[0].num)];
      // 地格
      this.nameFortune[2] = NameNumFortunesMap[num + num2];
      // 外格
      this.nameFortune[3] = NameNumFortunesMap[num2 + (this.firstName.length > 1 ? this.firstNameWords[0].num : 1)];
      // 總格
      let count = 0;
      this.firstNameWords.forEach(w => {
        count += w.num;
      });
      this.lastNameWords.forEach(w => {
        count += w.num;
      });
      this.nameFortune[4] = NameNumFortunesMap[count];

      // 三才
      this.currentFortune = NameFortunesMap[
        NumTypes[this.nameFortune[0].num % 10]
        +
        NumTypes[this.nameFortune[1].num % 10]
        +
        NumTypes[this.nameFortune[2].num % 10]
      ];
      let subType = this.currentFortune.type.substring(1);
      this.currentFortuneBasic = NameFortuneBasicsMap[subType];
      this.currentFortuneSuccess = NameFortuneSuccessMap[subType];
      this.currentFortuneSociality = NameFortuneSocialityMap[subType];
      this.currentFortuneSick = NameFortuneSickMap[this.currentFortune.type];
    });
  }
}

