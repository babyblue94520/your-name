import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { Async } from '@cui/core';

/**
 * 滾動到最上面按鈕
 */
@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollTopComponent {
  private ms = 300;
  private count = Math.floor(this.ms / 16);
  private px;
  private run = false;
  private timer;
  public show = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    document.body.addEventListener('scroll', this.isShow);
  }

  /**
   * 滾動到最上面
   */
  public top = () => {
    if (this.run) { return; }
    this.run = true;
    if (!this.px) {
      this.px = Math.floor(document.body.scrollTop / this.count);
    }
    this.show = false;
    clearTimeout(this.timer);
    this.timer = this.doScrollTop();
  }

  /**
   * 開始往上滾動
   */
  @Async(16)
  private doScrollTop() {
    if (document.body.scrollTop > 0) {
      document.body.scrollTop -= this.px;
      this.timer = this.doScrollTop();
    } else {
      this.px = 0;
      this.run = false;
    }
  }

  /**
   * 是否顯示
   */
  private isShow = () => {
    if (this.run) {
      return;
    }
    let b = document.body.scrollTop > 0;
    if (b != this.show) {
      this.show = b;
      this.changeDetectorRef.markForCheck();
    }
  }
}
