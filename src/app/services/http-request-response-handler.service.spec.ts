import { TestBed } from '@angular/core/testing';

import { HttpRequestResponseHandlerService } from './http-request-response-handler.service';

describe('HttpRequestResponseHandlerService', () => {
  let service: HttpRequestResponseHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRequestResponseHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
