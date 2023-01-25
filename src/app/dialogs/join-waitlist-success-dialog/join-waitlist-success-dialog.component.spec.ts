import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinWaitlistSuccessDialogComponent } from './join-waitlist-success-dialog.component';

describe('JoinWaitlistSuccessDialogComponent', () => {
  let component: JoinWaitlistSuccessDialogComponent;
  let fixture: ComponentFixture<JoinWaitlistSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinWaitlistSuccessDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinWaitlistSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
