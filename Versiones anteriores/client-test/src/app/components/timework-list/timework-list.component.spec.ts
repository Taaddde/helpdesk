import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeworkListComponent } from './timework-list.component';

describe('TimeworkListComponent', () => {
  let component: TimeworkListComponent;
  let fixture: ComponentFixture<TimeworkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeworkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeworkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
