import { TestBed } from '@angular/core/testing';

import { SocketIoNgxService } from './socket-io-ngx.service';

describe('SocketIoNgxService', () => {
  let service: SocketIoNgxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketIoNgxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
