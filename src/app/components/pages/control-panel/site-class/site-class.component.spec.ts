import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteClassComponent } from './site-class.component';

describe('SiteClassComponent', () => {
  let component: SiteClassComponent;
  let fixture: ComponentFixture<SiteClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
