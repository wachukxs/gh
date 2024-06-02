import { TestBed } from '@angular/core/testing';

import { ProfilePageResolver } from './profile-page.resolver';

describe('ProfilePageResolver', () => {
  let resolver: ProfilePageResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ProfilePageResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
