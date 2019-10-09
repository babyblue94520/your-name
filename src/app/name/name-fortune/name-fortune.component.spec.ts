import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameFortuneComponent } from './name-fortune.component';

describe('NameFortuneComponent', () => {
  let component: NameFortuneComponent;
  let fixture: ComponentFixture<NameFortuneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameFortuneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameFortuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
