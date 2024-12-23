import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockpageComponent } from './mockpage.component';

describe('MockpageComponent', () => {
  let component: MockpageComponent;
  let fixture: ComponentFixture<MockpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockpageComponent]
    });
    fixture = TestBed.createComponent(MockpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
