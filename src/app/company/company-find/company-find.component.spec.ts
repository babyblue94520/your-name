import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFindComponent } from './company-find.component';

describe('CompanyFindComponent', () => {
  let component: CompanyFindComponent;
  let fixture: ComponentFixture<CompanyFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
