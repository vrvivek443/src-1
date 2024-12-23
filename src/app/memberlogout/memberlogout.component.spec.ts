import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberlogoutComponent } from './memberlogout.component';

describe('MemberlogoutComponent', () => {
  let component: MemberlogoutComponent;
  let fixture: ComponentFixture<MemberlogoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberlogoutComponent]
    });
    fixture = TestBed.createComponent(MemberlogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
