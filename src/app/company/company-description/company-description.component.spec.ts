import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDescriptionComponent } from './company-description.component';

describe('CompanyDescriptionComponent', () => {
  let component: CompanyDescriptionComponent;
  let fixture: ComponentFixture<CompanyDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
