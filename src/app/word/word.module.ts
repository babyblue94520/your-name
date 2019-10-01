import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordComponent } from './word/word.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from 'app/app-common/app-common.module';
import { WordRouteName } from 'ts/ng/router/word';
import { WordDialogComponent } from './word-dialog/word-dialog.component';

@NgModule({
  imports: [
    CommonModule
    , RouterModule
    , FormsModule
    , AppCommonModule
  ]
  , declarations: [
    WordComponent
    , WordDialogComponent
  ]

})
export class WordModule {
  public static routes: Routes = [
    {
      path: '', component: WordComponent, children: [
        { path: '', redirectTo: WordRouteName.Word, pathMatch: 'full' },
        { path: WordRouteName.Word, component: WordComponent },
      ]
    }
  ];
}
