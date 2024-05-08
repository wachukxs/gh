import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedSaleContentComponent } from './feed-sale-content.component';

describe('FeedSaleContentComponent', () => {
  let component: FeedSaleContentComponent;
  let fixture: ComponentFixture<FeedSaleContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedSaleContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedSaleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
