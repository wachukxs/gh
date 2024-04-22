import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExitConfirmationDialogComponent } from './exit-confirmation-dialog.component';

describe('ExitConfirmationDialogComponent', () => {
  let component: ExitConfirmationDialogComponent;
  let fixture: ComponentFixture<ExitConfirmationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
