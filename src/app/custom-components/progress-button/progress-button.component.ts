import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-button',
  templateUrl: './progress-button.component.html',
  styleUrls: ['./progress-button.component.css']
})
export class ProgressButtonComponent {
  /**
   * TODO: This component should be able 
   * to take in all the props button elements takes in.
   * And maybe even some for mat-spinner.
   */
  @Input() loading: boolean = false;
  @Input() buttonText: string = 'Save';
  @Input() disabled: boolean = false;
  @Input() type: string = 'button'
}
