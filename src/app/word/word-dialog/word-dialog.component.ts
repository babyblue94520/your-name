import { AjaxUtil } from '@cui/core';
import { BasicComponent } from 'app/basic-component';
import { BasicState } from 'ts/constant/basic-state';
import { Component, Input, ViewChild } from '@angular/core';
import { CUI, IAjaxManagerResult } from '@cui/core';
import { DialogComponent } from 'app/app-common/component/dialog/dialog.component';
import { WordService } from 'ts/service/word-service';
import { Word } from 'ts/constant/word';

@Component({
  selector: 'app-word-dialog',
  templateUrl: './word-dialog.component.html',
  styleUrls: ['./word-dialog.component.scss']
})
export class WordDialogComponent extends BasicComponent {
  public state = BasicState.None;
  public title: string;
  public form: Word;
  public index: number;
  @ViewChild(DialogComponent)
  public dialog: DialogComponent;
  @Input()
  public onComplete: Function;
  @Input()
  public onCancel: Function;

  constructor() {
    super();
    this.initForm();
  }

  private initForm() {
    this.form = {
      num: undefined
      , word: ''
      , sound: ''
      , content: ''
      , type: ''
    };
  }

  /**
   * 開啟
   * @param state
   * @param form
   * @param index
   */
  public open(state: BasicState, form?: Word, index?: number) {
    this.state = state;
    this.index = index || 0;
    this.form = form;
    if (this.state == BasicState.Insert) {
      this.title = '新增';
      if (!form) {
        this.initForm();
      }
    } else if (this.state == BasicState.Update) {
      this.title = '修改';
    }
    this.dialog.open();
  }

  /**
   * 取消
   */
  public close() {
    this.dialog.close();
    this.cancel();
  }

  /**
   * 提交
   */
  public save = () => {
    if (this.state == BasicState.Insert) {
      // WordService.add(this.form, this.callback);
    } else if (this.state == BasicState.Update) {
      WordService.modify(this.form, this.callback);
    }
  }

  /**
   * 取消
   */
  public cancel = () => {
    this.state = BasicState.None;
    CUI.callFunction(this.onCancel);
  }

  /**
  * 新增返回
  */
  public callback = (result: IAjaxManagerResult) => {
    if (!result.success) {
      alert(AjaxUtil.getMessage(result));
      return;
    }
    this.dialog.close();
    CUI.callFunction(this.onComplete);
  }
}
