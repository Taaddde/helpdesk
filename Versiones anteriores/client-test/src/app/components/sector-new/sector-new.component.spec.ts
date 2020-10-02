import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorNewComponent } from './sector-new.component';

describe('SectorNewComponent', () => {
  let component: SectorNewComponent;
  let fixture: ComponentFixture<SectorNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
