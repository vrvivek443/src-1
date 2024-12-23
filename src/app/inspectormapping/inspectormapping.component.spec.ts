import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectormappingComponent } from './inspectormapping.component';

describe('InspectormappingComponent', () => {
  let component: InspectormappingComponent;
  let fixture: ComponentFixture<InspectormappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspectormappingComponent]
    });
    fixture = TestBed.createComponent(InspectormappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
