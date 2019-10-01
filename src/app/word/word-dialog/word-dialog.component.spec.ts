import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordDialogComponent } from './word-dialog.component';

describe('WordDialogComponent', () => {
  let component: WordDialogComponent;
  let fixture: ComponentFixture<WordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
