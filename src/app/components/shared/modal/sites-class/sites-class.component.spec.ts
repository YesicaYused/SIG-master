import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesClassComponent } from './sites-class.component';

describe('SitesClassComponent', () => {
  let component: SitesClassComponent;
  let fixture: ComponentFixture<SitesClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitesClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
