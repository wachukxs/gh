import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PictureCarouselComponent } from './picture-carousel.component';

describe('PictureCarouselComponent', () => {
  let component: PictureCarouselComponent;
  let fixture: ComponentFixture<PictureCarouselComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
