import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feed-content',
  templateUrl: './feed-content.component.html',
  styleUrls: ['./feed-content.component.css']
})
export class FeedContentComponent {

  @Input() post: any;
}
