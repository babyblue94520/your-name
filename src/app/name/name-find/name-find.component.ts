import { Component, ChangeDetectorRef, ElementRef, AfterContentInit, ViewChild } from '@angular/core';
import { Delay, Cache } from '@cui/core';
import { NameFortune, NameNumFortune, NameFortuneOther, NameFortuneSick } from 'ts/data/entity/entity';
import { NameFortuneService, NameNumFortunesMap, TypeNums, NameFortuneBasicsMap, NameFortuneSuccessMap, NameFortuneSocialityMap, NameFortuneSickMap } from 'ts/service/name-fortune-service';
import { WordService } from 'ts/service/word-service';
import { Word, FiveTypeWords } from 'ts/constant/word';

@Component({
  selector: 'app-name-find',
  templateUrl: './name-find.component.html',
  styleUrls: ['./name-find.component.scss']
})
export class NameFindComponent implements AfterContentInit {
  public fiveType = ['木', '火', '土', '金', '水', '?'];
  public nameFortune: NameNumFortune[] = [];
  @Cache.local('NameFind', undefined)
  public startNameWords: Word[] = [];
  @Cache.local('NameFind', '吳')
  public startName;
  public fortunes: NameFortune[];
  @Cache.local('NameFind', undefined)
  public currentFortune: NameFortune;
  @Cache.local('NameFind', undefined)
  public currentFortuneBasic: NameFortuneOther;
  @Cache.local('NameFind', undefined)
  public currentFortuneSuccess: NameFortuneOther;
  @Cache.local('NameFind', undefined)
  public currentFortuneSociality: NameFortuneOther;
  @Cache.local('NameFind', undefined)
  public currentFortuneSick: NameFortuneSick;


  @Cache.local('NameFind', undefined)
  public firstNums: Number[];
  @Cache.local('NameFind', undefined)
  public secondNums: Number[];
  @Cache.local('NameFind', undefined)
  public firstWords: FiveTypeWords[];
  @Cache.local('NameFind', undefined)
  public secondWords: FiveTypeWords[];
  @Cache.local('NameFind', undefined)
  public firstWord: Word;
  @Cache.local('NameFind', undefined)
  public secondWord: Word;
  @ViewChild('result')
  public resultElementRef: ElementRef;
  @ViewChild('option')
  public optionElementRef: ElementRef;

  private luckFilter = [
    '吉'
    , '半吉'
  ];

  constructor(private cdf: ChangeDetectorRef) {
    this.findFortunes();
  }

  ngAfterContentInit() {
    new MutationObserver((records: MutationRecord[]) => {
      this.reOptionHeight();
    }).observe(this.resultElementRef.nativeElement
      , {
        childList: true
        , characterData: true
        , subtree: true
      });
    this.reOptionHeight();
  }

  private reOptionHeight() {
    let windowHeight = window.innerHeight - 76;
    let resultHeight = this.resultElementRef.nativeElement.clientHeight;
    this.optionElementRef.nativeElement.style.height = (windowHeight > resultHeight ? windowHeight : resultHeight) + 'px';
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
    if (!this.startName) {
      this.fortunes = undefined;
      this.currentFortune = undefined;
      this.currentFortuneBasic = undefined;
      this.currentFortuneSuccess = undefined;
      this.currentFortuneSociality = undefined;
      this.currentFortuneSick = undefined;
      this.nameFortune = [];
      this.startNameWords = [];
      this.firstNums = undefined;
      this.secondNums = undefined;
      this.firstWords = undefined;
      this.secondWords = undefined;
      this.firstWord = undefined;
      this.secondWord = undefined;
      return;
    }
    WordService.find(this.startName, (result) => {
      if (!result.success) {
        alert(result.message);
      }
      let count;
      let ws = result.data;
      this.startNameWords = ws;
      if (ws.length > 1) {
        // 複數姓
        if (!ws[0]) {
          alert(this.startName[0] + ' 找不到');
        }
        if (!ws[1]) {
          alert(this.startName[1] + ' 找不到');
        }
        count = ws[0].num + ws[1].num;
      } else {
        // 單數姓
        if (!ws[0]) {
          alert(this.startName[0] + ' 找不到');
        }
        count = 1 + ws[0].num;
      }
      // 天格
      this.nameFortune[0] = NameNumFortunesMap[count];
      //
      NameFortuneService.findByNum(count, (result2) => {
        if (result2.success) {
          this.fortunes = result2.data;
        } else {
          alert(result2.message);
        }
      });
    });
  }

  /**
   * 選取三才配置
   * @param fortune
   */
  public selectedFortune(fortune: NameFortune) {
    this.currentFortune = fortune;
    let subType = fortune.type.substring(1);
    this.currentFortuneBasic = NameFortuneBasicsMap[subType];
    this.currentFortuneSuccess = NameFortuneSuccessMap[subType];
    this.currentFortuneSociality = NameFortuneSocialityMap[subType];
    this.currentFortuneSick = NameFortuneSickMap[fortune.type];
    this.firstNums = undefined;
    this.secondNums = undefined;
    this.firstWords = undefined;
    this.secondWords = undefined;
    this.firstWord = undefined;
    this.secondWord = undefined;
    this.nameFortune.splice(1);
    let nums = TypeNums[this.currentFortune.type[1]];
    let last = (this.startNameWords.length > 1 ? this.startNameWords[1].num : this.startNameWords[0].num);
    this.firstNums = [];
    let c;
    for (let i = 1; i < 34; i++) {
      c = (i + last) % 10;
      if (nums.indexOf(c) != -1) {
        let luck = NameNumFortunesMap[i + last].luck;
        if (this.luckFilter.indexOf(luck) != -1) {
          this.firstNums.push(i);
        }
      }
    }
    WordService.findNumType(this.firstNums, (result) => {
      this.firstWords = result.data;
    });
  }

  public selectedFirstWord(word: Word) {
    this.firstWord = word;
    this.countNameFortune();

    let nums = TypeNums[this.currentFortune.type[2]];
    let last = this.firstWord.num;
    this.secondNums = [];
    this.secondWord = undefined;
    let c;
    for (let i = 1; i < 31; i++) {
      c = (i + last) % 10;
      if (nums.indexOf(c) != -1) {
        let luck = NameNumFortunesMap[i + last].luck;
        if (this.luckFilter.indexOf(luck) != -1) {
          luck = NameNumFortunesMap[i + (this.startNameWords.length > 1 ? this.startNameWords[0].num : 1)].luck;
          if (this.luckFilter.indexOf(luck) != -1) {
            let count = 0;
            this.startNameWords.forEach(w => {
              count += w.num;
            });
            count += last;
            count += i;
            luck = NameNumFortunesMap[count].luck;
            if (this.luckFilter.indexOf(luck) != -1) {
              this.secondNums.push(i);
            }
          }
        }
      }
    }
    WordService.findNumType(this.secondNums, (result) => {
      this.secondWords = result.data;
    });
  }


  public selectedSecondWord(word: Word) {
    this.secondWord = word;
    this.countNameFortune();
  }

  private countNameFortune() {

    let num = this.firstWord.num;
    let num2 = this.secondWord ? this.secondWord.num : 1;
    // 人格
    this.nameFortune[1] = NameNumFortunesMap[num + (this.startNameWords.length > 1 ? this.startNameWords[1].num : this.startNameWords[0].num)];
    // 地格
    this.nameFortune[2] = NameNumFortunesMap[num + num2];
    // 外格
    this.nameFortune[3] = NameNumFortunesMap[num2 + (this.startNameWords.length > 1 ? this.startNameWords[0].num : 1)];
    // 總格
    let count = 0;
    this.startNameWords.forEach(w => {
      count += w.num;
    });
    count += num;
    count += (this.secondWord ? this.secondWord.num : 0);
    this.nameFortune[4] = NameNumFortunesMap[count];
  }
}

