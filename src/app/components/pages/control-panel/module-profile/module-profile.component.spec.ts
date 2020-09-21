import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleProfileComponent } from './module-profile.component';

describe('ModuleProfileComponent', () => {
  let component: ModuleProfileComponent;
  let fixture: ComponentFixture<ModuleProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
