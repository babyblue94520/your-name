import { Async } from '@cui/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';

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
  public target;
  private ms = 300;
  private count = Math.floor(this.ms / 16);
  private px;
  private run = false;
  private timer;
  public show = false;

  constructor(private cdf: ChangeDetectorRef) {
    this.target = document.scrollingElement;
    if (this.target == undefined) {
      this.target = document.documentElement;
    }
    window.addEventListener('scroll', this.isShow);
  }

  /**
   * 滾動到最上面
   */
  public top = () => {
    if (this.run) { return; }
    this.run = true;
    if (!this.px) {
      this.px = Math.floor(this.target.scrollTop / this.count);
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
    if (this.target.scrollTop > 0) {
      window.scrollTo(0, this.target.scrollTop - this.px);
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
    let top = window.pageYOffset || this.target.scrollTop;
    let b = top > 0;
    if (b != this.show) {
      this.show = b;
      this.cdf.markForCheck();
    }
  }
}
