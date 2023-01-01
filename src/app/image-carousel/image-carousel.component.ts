import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
// import Swiper core and required modules
import SwiperCore, { Keyboard, Pagination, Navigation, Virtual } from "swiper";

// install Swiper modules
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual]);

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageCarouselComponent implements OnInit { // is a stepper

  onClick(index: number): void {
  }

  onSwipeRight(event: any): void {
  }

  onSwipeLeft(event: any): void {
  }

  constructor() { }

  ngOnInit(): void {
  }

}
