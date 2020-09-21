import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleProfilesComponent } from './module-profiles.component';

describe('ModuleProfilesComponent', () => {
  let component: ModuleProfilesComponent;
  let fixture: ComponentFixture<ModuleProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
