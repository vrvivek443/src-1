import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberloginComponent } from './memberlogin.component';

describe('MemberloginComponent', () => {
  let component: MemberloginComponent;
  let fixture: ComponentFixture<MemberloginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberloginComponent]
    });
    fixture = TestBed.createComponent(MemberloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
