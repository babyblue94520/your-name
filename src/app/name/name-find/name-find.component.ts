import { Component, ChangeDetectorRef, ElementRef, AfterViewInit, AfterContentInit, ViewChild } from '@angular/core';
import { Delay, Cache } from '@cui/core';
import { NameFortune, NameNumFortune } from 'ts/data/entity/entity';
import { NameFortuneService, NameNumFortunesMap } from 'ts/service/name-fortune-service';
import { WordService } from 'ts/service/word-service';
import { Word, FiveTypeWords } from 'ts/constant/word';

@Component({
  selector: 'app-name-find',
  templateUrl: './name-find.component.html',
  styleUrls: ['./name-find.component.scss']
})
export class NameFindComponent implements AfterContentInit {
  public fiveType = ['木', '火', '土', '金', '水'];
  public nameFortune: NameNumFortune[] = [];
  @Cache.local('NameFind', undefined)
  public startNameWord: Word[] = [];
  public startName = '吳';
  @Cache.local('NameFind', undefined)
  public fortunes: NameFortune[];
  @Cache.local('NameFind', undefined)
  public currentFortune: NameFortune;
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
      this.nameFortune = [];
      this.startNameWord = [];
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
      this.startNameWord = ws;
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
    this.firstNums = undefined;
    this.secondNums = undefined;
    this.firstWords = undefined;
    this.secondWords = undefined;
    this.firstWord = undefined;
    this.secondWord = undefined;
    this.nameFortune.splice(1);
    let one = Number(this.currentFortune.num[1]);
    let last = (this.startNameWord.length > 1 ? this.startNameWord[1].num : this.startNameWord[0].num);
    this.firstNums = [];
    let c;
    for (let i = 1; i < 31; i++) {
      c = (i + last) % 10;
      if (c == one) {
        let luck = NameNumFortunesMap[i + last].luck;
        if (luck == '吉' || luck == '半吉') {
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

    let two = Number(this.currentFortune.num[2]);
    let last = this.firstWord.num;
    this.secondNums = [];
    this.secondWord = undefined;
    let c;
    for (let i = 1; i < 31; i++) {
      c = (i + last) % 10;
      if (c == two) {
        let luck = NameNumFortunesMap[i + last].luck;
        if (luck == '吉' || luck == '半吉') {
          this.secondNums.push(i);
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
    this.nameFortune[1] = NameNumFortunesMap[num + (this.startNameWord.length > 1 ? this.startNameWord[1].num : this.startNameWord[0].num)];
    // 地格
    this.nameFortune[2] = NameNumFortunesMap[num + num2];
    // 外格
    this.nameFortune[3] = NameNumFortunesMap[num2 + (this.startNameWord.length > 1 ? this.startNameWord[0].num : 1)];
    // 總格
    let count = 0;
    this.startNameWord.forEach(w => {
      count += w.num;
    });
    count += num;
    count += (this.secondWord ? this.secondWord.num : 0);
    this.nameFortune[4] = NameNumFortunesMap[count];
  }
}

