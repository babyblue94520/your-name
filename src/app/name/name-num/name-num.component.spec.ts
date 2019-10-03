import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameNumComponent } from './name-num.component';

describe('NameNumComponent', () => {
  let component: NameNumComponent;
  let fixture: ComponentFixture<NameNumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameNumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameNumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
