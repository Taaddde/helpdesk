import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksFinishedComponent } from './tasks-finished.component';

describe('TasksFinishedComponent', () => {
  let component: TasksFinishedComponent;
  let fixture: ComponentFixture<TasksFinishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksFinishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
