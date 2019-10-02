import { Cache } from '@cui/core';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CompanyFortune, Word } from 'ts/data/entity/entity';
import { CompanyFortuneService } from 'ts/service/company-fortune-service';
import { WordService } from 'ts/service/word-service';

interface Form {
  name1: string;
  name2: string;
}

@Component({
  selector: 'app-company-name',
  templateUrl: './company-name.component.html',
  styleUrls: ['./company-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyNameComponent {
  @Cache.session('CompanyName', {
    name1: '雲擎',
    name2: '雲端科技有限公司'
  })
  public form: Form;

  public words: Word[];
  public fortune1: CompanyFortune;
  public fortune2: CompanyFortune;
  public total1;
  public total2;
  public type: string;

  constructor() { }


  public submit() {
    if (!this.form.name1) {
      alert('請輸入公司名稱！');
      return;
    }
    if (!this.form.name2) {
      alert('請輸入公司行號！');
      return;
    }
    let names = WordService.getWords(this.form.name1.split(''));
    let subNames = WordService.getWords(this.form.name2.split(''));
    let count1 = 0, count2 = 0;
    let types = [];
    for (let i in names) {
      count1 += names[i].num;
      types.push(names[i].type);
    }
    for (let i in subNames) {
      count2 += subNames[i].num;
    }
    this.words = WordService.getWords(this.form.name1.split(''));
    this.total1 = count1;
    this.total2 = count1 + count2;
    this.fortune1 = CompanyFortuneService.getFortuneByNum(count1);
    this.fortune2 = CompanyFortuneService.getFortuneByNum((count1 + count2) % 80);
    this.type = types.join('>');
  }
}
