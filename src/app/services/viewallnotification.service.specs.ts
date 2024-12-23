import { TestBed } from '@angular/core/testing';

import { ViewAllNotificationService } from './viewallnotification.service';

describe('ComplaintService', () => {
    let service: ViewAllNotificationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ViewAllNotificationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});