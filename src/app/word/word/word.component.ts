import { BasicComponent } from 'app/basic-component';
import { Cache, CUI, Grid } from '@cui/core';
import { DomUtil } from 'ts/util/dom-util';
import { Word } from 'ts/data/entity/entity';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { WordDialogComponent } from '../word-dialog/word-dialog.component';
import { WordService } from 'ts/service/word-service';
import { DownloadUtil } from 'ts/util/download-util';


declare var Words: Word[];

interface SearchForm {
  word: string;
  num: number;
  type: string;
}

function defaultForm(): SearchForm {
  return {
    word: ''
    , num: undefined
    , type: ''
  };
}

@Component({
  selector: 'app-word'
  , templateUrl: './word.component.html'
  , styleUrls: ['./word.component.scss']
  , changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordComponent extends BasicComponent {
  public grid: Grid.Grid<Word>;

  @ViewChild(WordDialogComponent)
  public dialog: WordDialogComponent;
  @Cache.session('Word', defaultForm())
  public searchForm: SearchForm;

  public words = Words
    .filter(w => {
      return !w.type;
    })
    // .sort((a, b) => {
    //   let ac = String(a.content), bc = String(b.content);
    //   return ac.length > bc.length ? -1 : ac.length == bc.length ? 0 : 1;
    // })
    ;

  constructor() {
    super();
    this.grid = this.buildGrid();
    // this.grid.load();
    console.log(this.words)
  }

  /**
   * 查詢
   */
  public search() {
    this.grid.load();
  }

  /**
   * 清除查詢條件
   */
  public clean() {
    this.searchForm = defaultForm();
  }

  /**
   * 修改
   */
  public modify = (record: Word, index, e: Event) => {
    e.stopPropagation();
    this.dialog.open(this.BasicState.Update, CUI.deepClone(record), index);
  }

  public download() {
    // WordService.findAll({ sort: ['num'] }, (result) => {
    WordService.findAll({ sort: ['type'] }, (result) => {
      console.log(this.words[0], result.data[0], Words[0], this.words[0] == result.data[0], this.words[0] == Words[0], Words[0] == result.data[0])
      DownloadUtil.js('words.js', 'var Words = ' + JSON.stringify(result.data) + ';');
    });
  }

  /**
   * 刪除
   */
  public remove = (record: Word, index, e: Event) => {
    e.stopPropagation();
    if (!window.confirm('您確定要刪除紀錄?')) {
      return;
    }
    WordService.remove(record, (result) => {
      if (result.success) {
        this.grid.reload();
      } else {
        alert(result.message);
      }
    });
  }

  /**
   * 完成
   */
  public onComplete = () => {
    this.grid.reload();
  }

  /**
   * 產生grid
   */
  private buildGrid() {
    return Grid.GridBuilder.build({
      size: 1000
      , singleSort: false
      , rowColumns: [
        {
          value: '', name: '操作', align: 'left', width: '1%', element: true, tdTranslate: true
          , onRender: (value, record, index) => {
            return [
              DomUtil.buildButton({
                text: '修改'
                , className: 'small '
                , onclick: this.modify.bind(this, record, index)
              })
              , DomUtil.buildButton({
                text: '刪除'
                , className: 'bg-accent small '
                , onclick: this.remove.bind(this, record, index)
              })
            ];
          }
        }
        , {
          value: 'word', name: '字', align: 'left', width: '1%', canSort: true
        }
        , { value: 'num', name: '筆劃', align: 'left', width: '1%', canSort: true }
        , { value: 'sound', name: '音', align: 'left', width: '1%' }
        , { value: 'type', name: '五行', align: 'left', width: '1%', canSort: true }
        , { value: 'content', name: '字義', align: 'left', width: '100%', maxWidth: '1000px' }
      ]
      , contentColumns: [
        {
          value: 'content', name: ''
        }
      ]
      , onLoad: (pageable: Grid.IPageable, callback: Grid.ILoad<Word>) => {
        WordService.findAll(pageable, (result) => {
          if (result.success) {
            callback(result.data);
          } else {
            alert(result.message);
          }
        });
      }
    });
  }
}
