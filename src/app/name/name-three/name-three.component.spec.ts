import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameThreeComponent } from './name-three.component';

describe('NameThreeComponent', () => {
  let component: NameThreeComponent;
  let fixture: ComponentFixture<NameThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
