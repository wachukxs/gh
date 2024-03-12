import { Component, OnInit } from '@angular/core';
import { CallerService } from '../services/caller.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  corperSlug: string | null = ''
  constructor(private callerService: CallerService, private router: Router, 
    private route: ActivatedRoute) { 

    }

    ngOnInit() {
      this.corperSlug = this.route.snapshot.paramMap.get('route-id')
      
      // this.route.paramMap.subscribe((params: ParamMap) => {
      //   console.log('who?', params.get('route-id'));
      // })
    }
}
