
import { HammerGestureConfig } from '@angular/platform-browser';
import * as hammer from 'hammerjs';
import { Injectable } from '@angular/core';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
// import { HammerInstance } from '@angular/material/core';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: hammer.DIRECTION_HORIZONTAL },
    pinch: { enable: false },
    rotate: { enable: false }
  };

  // buildHammer(element: ImageCarouselComponent);
}
