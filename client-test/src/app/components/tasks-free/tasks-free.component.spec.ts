import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksFreeComponent } from './tasks-free.component';

describe('TasksFreeComponent', () => {
  let component: TasksFreeComponent;
  let fixture: ComponentFixture<TasksFreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksFreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
