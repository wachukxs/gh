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

    @ViewChild('rightButton', { static: false, read: ElementRef }) rightButton?: HTMLButtonElement
    @ViewChild('leftButton', { static: false, read: ElementRef }) leftButton?: HTMLButtonElement

    @Input() displayIndex!: number // should be sth unique.

    swiperConfig: SwiperOptions = {
        zoom: true,
        pagination: { clickable: true, dynamicBullets: true },
        // navigation: {
        //     nextEl: '.right-btn-' + this.displayIndex,
        //     prevEl: '.left-btn-' + this.displayIndex,
        // }
    }

    isSmallScreen$: Observable<boolean> = this.baseService.isSmallScreen$()

    onClick(index: number): void {}

    // from hammerjs, not used - swiper has same/similar event methods we can use
    onSwipeRight(event: any): void {}
    onSwipeLeft(event: any): void {}

    constructor(private baseService: BaseService) {}

    ngOnInit(): void {
        this.swiperConfig.navigation = {
            nextEl: '.right-btn-' + this.displayIndex,
            prevEl: '.left-btn-' + this.displayIndex,
        }
    }

    ngAfterViewInit(): void {}

    swipePrev() {
        // this.swiper?.swiperRef.slidePrev();
    }
    swipeNext() {
        // this.swiper?.swiperRef.slideNext();
    }
}
