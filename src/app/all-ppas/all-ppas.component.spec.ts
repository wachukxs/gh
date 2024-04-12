import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPpasComponent } from './all-ppas.component';

describe('AllPpasComponent', () => {
  let component: AllPpasComponent;
  let fixture: ComponentFixture<AllPpasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPpasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPpasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
