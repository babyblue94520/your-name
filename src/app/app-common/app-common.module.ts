import { AccordionComponent } from './component/accordion/accordion.component';
import { AutoCompleteDirective } from './directive/auto-complete/auto-complete.directive';
import { CommonModule } from '@angular/common';
import { DatePickerDirective } from './directive/date-picker/date-picker.directive';
import { DatePipe } from './pipe/date/date.pipe';
import { DialogComponent } from './component/dialog/dialog.component';
import { InitElementDirective } from './directive/init-element/init-element.directive';
import { MoneyPipe } from './pipe/money/money.pipe';
import { NgModule } from '@angular/core';
import { QuickDatePickerComponent } from './component/quick-date-picker/quick-date-picker.component';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from './pipe/safe-html/safe-html.pipe';
import { ScrollTopComponent } from './component/scroll-top/scroll-top.component';
import { ShrinkComponent } from './component/shrink/shrink.component';
import { TabComponent } from './component/tabs/tab/tab.component';
import { TabGroupComponent } from './component/tabs/tab-group/tab-group.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    AccordionComponent,
    DatePickerDirective,
    AutoCompleteDirective,
    InitElementDirective,
    SafeHtmlPipe,
    DatePipe,
    MoneyPipe,
    DialogComponent,
    ShrinkComponent,
    ScrollTopComponent,
    QuickDatePickerComponent,
    TabComponent,
    TabGroupComponent,
  ],
  exports: [
    AccordionComponent,
    DatePickerDirective,
    AutoCompleteDirective,
    InitElementDirective,
    SafeHtmlPipe,
    DatePipe,
    MoneyPipe,
    DialogComponent,
    ShrinkComponent,
    ScrollTopComponent,
    QuickDatePickerComponent,
    TabComponent,
    TabGroupComponent,
  ]
})
export class AppCommonModule { }
