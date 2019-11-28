import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassForgotComponent } from './pass-forgot.component';

describe('PassForgotComponent', () => {
  let component: PassForgotComponent;
  let fixture: ComponentFixture<PassForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassForgotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
