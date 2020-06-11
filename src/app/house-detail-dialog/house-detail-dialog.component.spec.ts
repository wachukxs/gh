import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseDetailDialogComponent } from './house-detail-dialog.component';

describe('HouseDetailDialogComponent', () => {
  let component: HouseDetailDialogComponent;
  let fixture: ComponentFixture<HouseDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
