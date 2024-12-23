import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllNotificationComponent } from './view-all-notification.component';

describe('ViewAllNotificationComponent', () => {
  let component: ViewAllNotificationComponent;
  let fixture: ComponentFixture<ViewAllNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAllNotificationComponent]
    });
    fixture = TestBed.createComponent(ViewAllNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
