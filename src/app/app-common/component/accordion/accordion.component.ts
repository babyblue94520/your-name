
import { CUI, Async } from '@cui/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { AuthRoute } from 'ts/data/entity/entity';


interface RouteActive extends AuthRoute {
  active?: boolean;
}

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent {
  private timers = {};
  public routes: RouteActive[];
  public nextArray = {};
  public activeClassName = 'active';

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  @Input() set array(array: RouteActive[]) {
    let temps = CUI.deepClone(array);
    let route: RouteActive;
    let parentId;
    this.routes = [];
    this.nextArray = {};
    for (let i in temps) {
      route = temps[i];
      parentId = route.parentId;
      if (parentId != 0) {
        if (!this.nextArray[parentId]) {
          this.nextArray[parentId] = [];
        }
        this.nextArray[parentId].push(route);
        route.parentId = 0;
      } else {
        this.routes.push(route);
      }
    }
    this.routes.sort((a, b) => {
      return a.order > b.order ? 1 : a.order == b.order ? 0 : -1;
    });
  }

  /**
   *
   * @param data
   */
  public open(route: RouteActive, child: HTMLElement) {
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
