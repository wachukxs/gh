import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSignupPromptComponent } from './login-signup-prompt.component';

describe('LoginSignupPromptComponent', () => {
  let component: LoginSignupPromptComponent;
  let fixture: ComponentFixture<LoginSignupPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginSignupPromptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginSignupPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
