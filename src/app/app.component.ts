import { BasicComponent } from 'app/basic-component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MainMenuWidthNode } from 'ts/data/node/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends BasicComponent {
  public paddingLeft = '0px';

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
    this.listenNode(MainMenuWidthNode, () => {
      this.paddingLeft = MainMenuWidthNode.get() + 'px';
      this.changeDetectorRef.markForCheck();
    }, true);
  }

}
