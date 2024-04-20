import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CallerService } from './services/caller.service';
import { setCorpMemberProfileData } from './ngrx-store/actions/corp-member.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private callerService: CallerService) {
    const corpMemberLocal = localStorage.getItem(callerService.LOCAL_STORAGE_DATA_KEY)

    if (corpMemberLocal) {
        const savedSessionData = JSON.parse(corpMemberLocal)
        this.callerService._store.dispatch(setCorpMemberProfileData({data: savedSessionData}))
    }

  }
}
