import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesFeedComponent } from './sales-feed.component';

describe('SalesFeedComponent', () => {
  let component: SalesFeedComponent;
  let fixture: ComponentFixture<SalesFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesFeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
