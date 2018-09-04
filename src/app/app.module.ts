import { AppCommonModule } from './app-common/app-common.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
  Routes,
  NavigationCancel,
  RouterEvent,
  Router,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { IndexComponent } from './index/index.component';
import { AppRouteName } from 'ts/ng/router/app';
import { Global } from 'ts/globle';
import { MenuComponent } from 'app/menu/menu.component';
import { FooterComponent } from 'app/footer/footer.component';
import { HeaderComponent } from 'app/header/header.component';
import { CompanyModule } from './company/company.module';
import { MenuRoutes } from 'ts/data/word/routes';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MenuComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppModule.routes, { useHash: true }),
    AppCommonModule,
    CompanyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  public static routes: Routes = [
    { path: '', redirectTo: AppRouteName.Index, pathMatch: 'full' },
    { path: AppRouteName.Index, component: IndexComponent },
    { path: AppRouteName.Company, children: CompanyModule.routes },
    /**
     * NotFound
     */
    { path: '**', component: NotFoundComponent },
  ];

  constructor(private router: Router) {

    Global.routeName = {};
    for (let i in MenuRoutes) {
      Global.routeName[MenuRoutes[i].path.join('/')] = MenuRoutes[i].name;
    }
    console.log(Global.routeName);
    // 路由切換遮罩
    router.events.subscribe((e: RouterEvent) => {
      if (e instanceof NavigationEnd) {
        console.log(e.url);
        Global.currentRouteName = Global.routeName[e.url] || '';
      }
    });
  }
}
