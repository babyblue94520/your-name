import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameFindComponent } from './name-find.component';

describe('NameFindComponent', () => {
  let component: NameFindComponent;
  let fixture: ComponentFixture<NameFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
