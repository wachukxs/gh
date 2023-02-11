import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CorpMemberEffects } from './corp-member.effects';

describe('CorpMemberEffects', () => {
  let actions$: Observable<any>;
  let effects: CorpMemberEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CorpMemberEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(CorpMemberEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
