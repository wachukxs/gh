
import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import { Injectable } from '@angular/core';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
// import { HammerInstance } from '@angular/material/core';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pan: { direction: Hammer.DIRECTION_All },
    swipe: { direction: Hammer.DIRECTION_VERTICAL },
    pinch: { enable: false },
    rotate: { enable: false }
  };

  buildHammer(element: HTMLElement) { // https://stackoverflow.com/a/60761571
    const mc = new Hammer(element, {
      touchAction: 'auto',
          inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput,
          recognizers: [
            [Hammer.Swipe, {
              direction: Hammer.DIRECTION_HORIZONTAL
            }]
          ]
    });
    return mc;
  }
}
