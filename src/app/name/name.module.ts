import { AppCommonModule } from '../app-common/app-common.module';
import { CommonModule } from '@angular/common';
import { NameRouteName } from 'ts/ng/router/name';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NameThreeComponent } from './name-three/name-three.component';
import { NameComponent } from './name.component';
import { NameFindComponent } from './name-find/name-find.component';
import { NameNumComponent } from './name-num/name-num.component';
import { NameFortuneComponent } from './name-fortune/name-fortune.component';

@NgModule({
  imports: [
    CommonModule
    , RouterModule
    , FormsModule
    , AppCommonModule
  ],
  declarations: [
    NameComponent
    , NameThreeComponent
    , NameFindComponent
    , NameNumComponent
    , NameFortuneComponent
  ]
})
export class NameModule {
  public static routes: Routes = [
    {
      path: '', component: NameComponent, children: [
        { path: '', redirectTo: NameRouteName.Fortune, pathMatch: 'full' },
        { path: NameRouteName.Fortune, component: NameFortuneComponent },
        { path: NameRouteName.Find, component: NameFindComponent },
        { path: NameRouteName.Three, component: NameThreeComponent },
        { path: NameRouteName.Num, component: NameNumComponent },
      ]
    }
  ];
}
