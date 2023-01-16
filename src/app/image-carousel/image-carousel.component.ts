import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
// import Swiper core and required modules
import SwiperCore, { Keyboard, Pagination, Navigation, Virtual, SwiperOptions, A11y } from "swiper";
import { BaseService } from '../services/base.service';
import { Observable } from 'rxjs';

// install Swiper modules
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual, A11y]);

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageCarouselComponent implements OnInit, AfterViewInit { // is a stepper
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  
  @ViewChild('rightButton', { static: false, read: ElementRef }) rightButton?: HTMLButtonElement;
  @ViewChild('leftButton', { static: false, read: ElementRef }) leftButton?: HTMLButtonElement;
  
  @Input() displayIndex: null | number = null

  swiperConfig: SwiperOptions = {
    // slidesPerView: 3,
    // spaceBetween: 50,
    // navigation: true, // automatically added
    pagination: { clickable: true, dynamicBullets: true },
    // scrollbar: { draggable: true },
    // breakpoints: {
    // }
  };

  isSmallScreen$: Observable<boolean> = this.baseService.isSmallScreen$()

  onClick(index: number): void {
  }

  // from hammerjs, not used
  onSwipeRight(event: any): void {
  }
  onSwipeLeft(event: any): void {
  }

  swipePrev() {

  }

  swipeNext() {

  }

  constructor(private baseService: BaseService) { }

  ngOnInit(): void {

    // automatically added swiper button navigation
    this.baseService.isSmallScreen$().subscribe({
      next: (isSmallScreen) => {
          console.log('is hand', isSmallScreen);
          if (isSmallScreen) {
              this.swiperConfig.navigation = false
          } else {
            // this.swiperConfig.navigation = true

            this.swiperConfig.navigation = {
              nextEl: '.right-btn-' + this.displayIndex,
              prevEl: '.left-btn-' + this.displayIndex,
            }
          }  
      },
      error: (err) => {
          console.log('ish', err);
      }
  })
  }


  ngAfterViewInit(): void {
  }

}
