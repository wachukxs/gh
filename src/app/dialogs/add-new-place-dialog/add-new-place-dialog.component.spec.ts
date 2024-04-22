import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPlaceDialogComponent } from './add-new-place-dialog.component';

describe('AddNewPlaceDialogComponent', () => {
  let component: AddNewPlaceDialogComponent;
  let fixture: ComponentFixture<AddNewPlaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewPlaceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewPlaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
