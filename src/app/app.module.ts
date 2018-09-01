import { AppCommonModule } from './app-common/app-common.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { IndexComponent } from './index/index.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppModule.routes, { useHash: true }),
    AppCommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  public static routes: Routes = [
    { path: '', redirectTo: AppRouteName.Index, pathMatch: 'full' },
    { path: AppRouteName.Index, component: IndexComponent },
    /**
     * NotFound
     */
    { path: '**', component: NotFoundComponent },
  ];

  constructor() {
    // 解析URL Paramters
    Global.parseQueryString();
    // 加載入動畫物件
    document.body.appendChild(Global.loader.getElement());
  }
}
