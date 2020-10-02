import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeworkSubtypeListComponent } from './timework-subtype-list.component';

describe('TimeworkSubtypeListComponent', () => {
  let component: TimeworkSubtypeListComponent;
  let fixture: ComponentFixture<TimeworkSubtypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeworkSubtypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeworkSubtypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
