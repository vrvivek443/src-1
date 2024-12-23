import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSearchProfileComponent } from './manage-search-profile.component';

describe('ManageSearchProfileComponent', () => {
  let component: ManageSearchProfileComponent;
  let fixture: ComponentFixture<ManageSearchProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageSearchProfileComponent]
    });
    fixture = TestBed.createComponent(ManageSearchProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
