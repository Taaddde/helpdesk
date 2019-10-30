/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketReportComponent } from './ticket-report.component';

describe('TicketReportComponent', () => {
  let component: TicketReportComponent;
  let fixture: ComponentFixture<TicketReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
