import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickDatePickerComponent } from './quick-date-picker.component';

describe('QuickDatePickerComponent', () => {
  let component: QuickDatePickerComponent;
  let fixture: ComponentFixture<QuickDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
