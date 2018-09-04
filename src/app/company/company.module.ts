import { AppCommonModule } from '../app-common/app-common.module';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { CompanyDescriptionComponent } from './company-description/company-description.component';
import { CompanyFindComponent } from './company-find/company-find.component';
import { CompanyNameComponent } from './company-name/company-name.component';
import { CompanyRouteName } from 'ts/ng/router/company';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RuleComponent } from './rule/rule.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppCommonModule,
  ],
  declarations: [
    CompanyComponent,
    CompanyNameComponent,
    CompanyFindComponent,
    CompanyDescriptionComponent,
    RuleComponent
  ]
})
export class CompanyModule {
  public static routes: Routes = [
    {
      path: '', component: CompanyComponent, children: [
        { path: '', redirectTo: CompanyRouteName.Name, pathMatch: 'full' },
        { path: CompanyRouteName.Name, component: CompanyNameComponent },
        { path: CompanyRouteName.Find, component: CompanyFindComponent },
        { path: CompanyRouteName.Description, component: CompanyDescriptionComponent },
        { path: CompanyRouteName.Rule, component: RuleComponent },
      ]
    }
  ];
}
