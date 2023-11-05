import { TestBed } from '@angular/core/testing';

import { BaseInterceptorInterceptor } from './base-interceptor.interceptor';

describe('BaseInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BaseInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BaseInterceptorInterceptor = TestBed.inject(BaseInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
