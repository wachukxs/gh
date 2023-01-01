import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewAccommodationComponent } from './create-new-accommodation.component';

describe('CreateNewAccommodationComponent', () => {
  let component: CreateNewAccommodationComponent;
  let fixture: ComponentFixture<CreateNewAccommodationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewAccommodationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewAccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
