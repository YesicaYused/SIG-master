import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacesSettingsComponent } from './interfaces-settings.component';

describe('InterfacesSettingsComponent', () => {
  let component: InterfacesSettingsComponent;
  let fixture: ComponentFixture<InterfacesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
