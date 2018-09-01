import { AccordionComponent } from './component/accordion/accordion.component';
import { AutoCompleteDirective } from './directive/auto-complete/auto-complete.directive';
import { CommonModule } from '@angular/common';
import { DatePickerDirective } from './directive/date-picker/date-picker.directive';
import { DatePipe } from './pipe/date/date.pipe';
import { DialogComponent } from './component/dialog/dialog.component';
import { InitElementDirective } from './directive/init-element/init-element.directive';
import { MomeyPipe } from './pipe/momey/momey.pipe';
import { NgModule } from '@angular/core';
import { QuickDatePickerComponent } from './component/quick-date-picker/quick-date-picker.component';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from './pipe/safe-html/safe-html.pipe';
import { ScrollTopComponent } from './component/scroll-top/scroll-top.component';
import { ShrinkComponent } from './component/shrink/shrink.component';
import { TabComponent } from './component/tabs/tab/tab.component';
import { TabGroupComponent } from './component/tabs/tab-group/tab-group.component';
import { FieldComponent } from './component/field/field/field.component';


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
    MomeyPipe,
    DialogComponent,
    ShrinkComponent,
    ScrollTopComponent,
    QuickDatePickerComponent,
    TabComponent,
    TabGroupComponent,
    FieldComponent,
  ],
  exports: [
    AccordionComponent,
    DatePickerDirective,
    AutoCompleteDirective,
    InitElementDirective,
    SafeHtmlPipe,
    DatePipe,
    MomeyPipe,
    DialogComponent,
    ShrinkComponent,
    ScrollTopComponent,
    QuickDatePickerComponent,
    TabComponent,
    TabGroupComponent,
    FieldComponent,
  ]
})
export class AppCommonModule { }
