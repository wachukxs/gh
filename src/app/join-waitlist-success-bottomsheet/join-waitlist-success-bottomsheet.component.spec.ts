import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinWaitlistSuccessBottomsheetComponent } from './join-waitlist-success-bottomsheet.component';

describe('JoinWaitlistSuccessBottomsheetComponent', () => {
  let component: JoinWaitlistSuccessBottomsheetComponent;
  let fixture: ComponentFixture<JoinWaitlistSuccessBottomsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinWaitlistSuccessBottomsheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinWaitlistSuccessBottomsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
