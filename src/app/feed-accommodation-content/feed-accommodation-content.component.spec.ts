import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedAccommodationContentComponent } from './feed-accommodation-content.component';

describe('FeedAccommodationContentComponent', () => {
  let component: FeedAccommodationContentComponent;
  let fixture: ComponentFixture<FeedAccommodationContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedAccommodationContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedAccommodationContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
