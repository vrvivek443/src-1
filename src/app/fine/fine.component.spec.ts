import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineComponent } from './fine.component';

describe('FineComponent', () => {
  let component: FineComponent;
  let fixture: ComponentFixture<FineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FineComponent]
    });
    fixture = TestBed.createComponent(FineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
