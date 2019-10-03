import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Delay } from '@cui/core';
import { NameFortune } from 'ts/data/entity/entity';
import { NameFortuneService, NameNumFortunesMap } from 'ts/service/name-fortune-service';
import { WordService } from 'ts/service/word-service';
import { Word, IWordByNumType, FiveTypeWords } from 'ts/constant/word';

@Component({
  selector: 'app-name-find',
  templateUrl: './name-find.component.html',
  styleUrls: ['./name-find.component.scss']
})
export class NameFindComponent {
  public fiveType = ['木', '火', '土', '金', '水'];
  public numbers = [];
  public firstName: string = '吳';
  public lastName: string = '';
  public fortunes: NameFortune[];
  public currentFortune: NameFortune;
  public firstNums: Number[];
  public secondNums: Number[];
  public firstWords: FiveTypeWords[];
  public secondWords: FiveTypeWords[];
  public firstWord: Word;
  public secondWord: Word;

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
      this.firstNums = undefined;
      this.secondNums = undefined;
      this.firstWords = undefined;
      this.secondWords = undefined;
      this.firstWord = undefined;
      this.secondWord = undefined;
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
    this.firstNums = undefined;
    this.secondNums = undefined;
    this.firstWords = undefined;
    this.secondWords = undefined;
    this.firstWord = undefined;
    this.secondWord = undefined;
    let one = Number(this.currentFortune.num[1]);
    let last = this.numbers[0];
    this.firstNums = [];
    let c;
    for (let i = 1; i < 31; i++) {
      c = (i + last) % 10;
      if (c == one) {
        let luck = NameNumFortunesMap[i + last].luck;
        if (luck == '吉') {
          this.firstNums.push(i);
        }
      }
    }
    console.log(this.firstNums);
    WordService.findNumType(this.firstNums, (result) => {
      this.firstWords = result.data;
    });
    console.log(this.firstWords);
  }

  public selectedFirstWord(word: Word) {
    this.firstWord = word;

    WordService.find(this.firstWord.word, (result) => {
      console.log(this.firstWord, result.data);
      this.numbers[1] = result.data[0].num;
    });

    let two = Number(this.currentFortune.num[2]);
    let last = this.numbers[1];
    this.secondNums = [];
    let c;
    for (let i = 1; i < 31; i++) {
      c = (i + last) % 10;
      if (c == two) {
        let luck = NameNumFortunesMap[i + last].luck;
        if (luck == '吉') {
          this.secondNums.push(i);
        }
      }
    }
    console.log(this.secondNums);
    WordService.findNumType(this.secondNums, (result) => {
      this.secondWords = result.data;
    });
    console.log(this.secondWords);
  }


  public selectedSecondWord(word: Word) {
    this.secondWord = word;
  }
}

