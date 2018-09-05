import { Component, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Cache, Delay } from '@cui/core';
import { FortuneService } from 'ts/service/fortune-service';
import { Word } from 'ts/data/entity/entity';
import { ShrinkComponent } from 'app/app-common/component/shrink/shrink.component';

declare var WordsByNum: any;

interface Form {
  total: number;
  count: number;
}

interface FiveElementsWords {
  '木': Word[];
  '火': Word[];
  '土': Word[];
  '金': Word[];
  '水': Word[];
}

@Component({
  selector: 'app-company-find',
  templateUrl: './company-find.component.html',
  styleUrls: ['./company-find.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyFindComponent {
  @Cache.session('CompanyFind', {
    total: 29,
    count: 2
  })
  public form: Form;

  public numGroups = [];

  public fiveWords: FiveElementsWords;
  public woodWords: Word[];
  public fireWords: Word[];
  public earthWords: Word[];
  public goldWords: Word[];
  public waterWords: Word[];

  public currentGroup = [];
  public firstWord: Word;

  public name: Word[];
  public nameTypes: string[];
  public nameWords: Word[][];

  @ViewChild('groupShrink')
  public groupShrink: ShrinkComponent;

  @ViewChild('firstWordShrink')
  public firstWordShrink: ShrinkComponent;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.findNumGroup();
  }

  @Delay(1000)
  public delayFindNumGroup() {
    this.changeDetectorRef.markForCheck();
    this.findNumGroup();
  }

  /**
   * 找出筆劃字數組合陣列
   */
  public findNumGroup() {
    this.numGroups = FortuneService.getNumGroup(this.form.total, this.form.count);
    this.currentGroup = undefined;
    this.fiveWords = undefined;
    this.name = undefined;
    this.nameTypes = undefined;
    this.nameWords = undefined;
    if (this.groupShrink) {
      this.groupShrink.open();
    }
  }

  /**
   * 選擇筆劃字數組合
   * @param group
   */
  public selectedGroup(group: number[]) {
    if (this.currentGroup == group) {
      return;
    }
    this.currentGroup = group;
    this.fiveWords = WordsByNum[this.currentGroup[0]] as FiveElementsWords;
    this.woodWords = this.fiveWords['木'];
    this.fireWords = this.fiveWords['火'];
    this.earthWords = this.fiveWords['土'];
    this.goldWords = this.fiveWords['金'];
    this.waterWords = this.fiveWords['水'];
    this.firstWord = undefined;
    this.name = undefined;
    this.nameTypes = undefined;
    this.nameWords = undefined;
    if (this.groupShrink) {
      this.groupShrink.close();
    }
  }

  /**
   * 選擇開頭文字
   * @param word
   */
  public selectedFirstWord(word: Word) {
    let nextType = FortuneService.getNextType(word.type);
    let nextWords = FortuneService.getGoodNextWords(this.currentGroup[1], nextType);
    this.firstWord = word;
    this.name = [word];
    this.nameTypes = [word.type, nextType];
    this.nameWords = [nextWords];
  }


  /**
   * 選擇下一個文字
   * @param word
   */
  public selectedNextWord(index: number, word: Word) {
    this.name.length = index + 1;
    this.nameTypes.length = index + 2;
    this.nameWords.length = index + 1;
    this.name.push(word);
    if (this.name.length == this.currentGroup.length) {
      return;
    }
    let nextType = FortuneService.getNextType(word.type);
    let nextWords = FortuneService.getGoodNextWords(this.currentGroup[1], nextType);
    this.nameTypes.push(nextType);
    this.nameWords.push(nextWords);
  }

  public getNameByIndex(index: number, word: Word) {
    let name = '';
    for (let i = 0; i <= index; i++) {
      name += this.name[i].word;
    }
    return name + word.word;
  }
}
