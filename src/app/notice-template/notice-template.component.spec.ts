import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeTemplateComponent } from './notice-template.component';

describe('NoticeTemplateComponent', () => {
  let component: NoticeTemplateComponent;
  let fixture: ComponentFixture<NoticeTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeTemplateComponent]
    });
    fixture = TestBed.createComponent(NoticeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
