import { TestBed } from '@angular/core/testing';

import { InLocalGuard } from './in-local.guard';

describe('InLocalGuard', () => {
  let guard: InLocalGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InLocalGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
