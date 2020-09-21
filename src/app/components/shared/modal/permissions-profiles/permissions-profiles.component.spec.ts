import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsProfilesComponent } from './permissions-profiles.component';

describe('PermissionsProfilesComponent', () => {
  let component: PermissionsProfilesComponent;
  let fixture: ComponentFixture<PermissionsProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionsProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
