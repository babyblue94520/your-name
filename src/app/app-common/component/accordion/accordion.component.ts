
import { Async } from '@cui/core';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { AuthRoute } from 'ts/data/entity/entity';



@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent {
  private timers = {};
  public routes: AuthRoute[] = [];
  public activeClassName = 'active';

  @Input()
  public childs = {};

  constructor() { }

  @Input() set array(array: AuthRoute[]) {
    this.routes = array || [];
    this.routes.sort((a, b) => {
      return a.sort > b.sort ? 1 : a.sort == b.sort ? 0 : -1;
    });
  }

  /**
   *
   * @param data
   */
  public open(route: AuthRoute, child: HTMLElement) {
    clearTimeout(this.timers[route.id]);
    if (route.active) {
      this.timers[route.id] = this.heightZero(child);
    } else {
      this.timers[route.id] = this.heightAuto(child);
    }
    route.active = !route.active;
    child.style.height = (<HTMLElement>child.querySelector('div')).offsetHeight + 'px';
  }

  @Async(300)
  private heightAuto(child: HTMLElement) {
    child.style.height = 'auto';
  }

  @Async(0)
  private heightZero(child: HTMLElement) {
    child.style.height = '0px';
  }
}
