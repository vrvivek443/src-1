import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageComplaintsComponent } from './manage-complaints.component';

describe('ManageComplaintsComponent', () => {
  let component: ManageComplaintsComponent;
  let fixture: ComponentFixture<ManageComplaintsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageComplaintsComponent]
    });
    fixture = TestBed.createComponent(ManageComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
