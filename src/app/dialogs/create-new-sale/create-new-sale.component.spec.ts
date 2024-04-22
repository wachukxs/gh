import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewSaleComponent } from './create-new-sale.component';

describe('CreateNewSaleComponent', () => {
  let component: CreateNewSaleComponent;
  let fixture: ComponentFixture<CreateNewSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
