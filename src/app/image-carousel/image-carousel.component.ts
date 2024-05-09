import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
// import Swiper core and required modules
import SwiperCore, { Keyboard, Pagination, Navigation, Virtual, SwiperOptions, A11y } from "swiper";
import { BaseService } from '../services/base.service';
import { Observable } from 'rxjs';

// install Swiper modules
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual, A11y])

@Component({
    selector: 'app-image-carousel',
    templateUrl: './image-carousel.component.html',
    styleUrls: ['./image-carousel.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ImageCarouselComponent implements OnInit, AfterViewInit {
    // is a stepper
    @ViewChild('swiper', { static: false }) swiper?: SwiperComponent

    @Input() images!: Array<any>

    uniqueClass: string = Math.random().toString().substring(2)

    swiperConfig: SwiperOptions = {
        zoom: true,
        pagination: { clickable: true, dynamicBullets: true },
        navigation: {
            nextEl: '.next-button-' + this.uniqueClass,
            prevEl: '.prev-button-' + this.uniqueClass,
        }
    }

    isSmallScreen$: Observable<boolean> = this.baseService.isSmallScreen$()

    constructor(private baseService: BaseService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    swipePrev() {
        // this.swiper?.swiperRef.slidePrev();
    }
    swipeNext() {
        // this.swiper?.swiperRef.slideNext();
    }
    // from hammerjs, not used - swiper has same/similar event methods we can use
    onSwipeRight(event: any): void {}
    onSwipeLeft(event: any): void {}
}
