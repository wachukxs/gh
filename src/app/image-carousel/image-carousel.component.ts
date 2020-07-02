import { Component, OnInit } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css'],
  providers: [{ provide: CdkStepper, useExisting: ImageCarouselComponent }]
})
export class ImageCarouselComponent extends CdkStepper /* implements OnInit */ { // is a stepper

  action = 'do sth';
  onClick(index: number): void {
    this.selectedIndex = index;
  }

  onSwipeRight(event): void {
    this.action = 'swiped right';
    setTimeout(() => {
      this.action = 'do sth';
    }, 3000);
    this.previous();
  }

  onSwipeLeft(event): void {
    this.action = 'swiped left';
    setTimeout(() => {
      this.action = 'do sth';
    }, 3000);
    this.next();
  }

  /* constructor() { }

  ngOnInit(): void {
  } */

}
