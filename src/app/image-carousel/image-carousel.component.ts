import { Component, OnInit } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css'],
  providers: [{ provide: CdkStepper, useExisting: ImageCarouselComponent }]
})
export class ImageCarouselComponent extends CdkStepper /* implements OnInit */ { // is a stepper

  onClick(index: number): void {
    this.selectedIndex = index;
  }

  onSwipeRight(): void {
    this.previous();
  }

  onSwipeLeft(): void {
    this.next();
  }

  /* constructor() { }

  ngOnInit(): void {
  } */

}
