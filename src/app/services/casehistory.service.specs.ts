import { TestBed } from '@angular/core/testing';

import { CaseHistoryService } from './casehistory.service';

describe('ComplaintService', () => {
  let service: CaseHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
