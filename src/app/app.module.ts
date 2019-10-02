import { AppCommonModule } from './app-common/app-common.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
  Routes,
  RouterEvent,
  Router,
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
import { WordModule } from './word/word.module';
import { NameModule } from './name/name.module';

@NgModule({
  declarations: [
    AppComponent
    , NotFoundComponent
    , HeaderComponent
    , FooterComponent
    , MenuComponent
    , MenuComponent
    , IndexComponent
  ],
  imports: [
    BrowserModule
    , RouterModule.forRoot(AppModule.routes, { useHash: true })
    , AppCommonModule
    , CompanyModule
    , NameModule
    , WordModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  public static routes: Routes = [
    { path: '', redirectTo: AppRouteName.Index, pathMatch: 'full' },
    { path: AppRouteName.Index, component: IndexComponent },
    { path: AppRouteName.Company, children: CompanyModule.routes },
    { path: AppRouteName.Name, children: NameModule.routes },
    { path: AppRouteName.Word, children: WordModule.routes },
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
    // 路由切換遮罩
    router.events.subscribe((e: RouterEvent) => {
      if (e instanceof NavigationEnd) {
        Global.currentRouteName = Global.routeName[e.url] || '';
      }
    });
    // 加載入動畫物件
    document.body.appendChild(Global.loader.getElement());
  }
}
