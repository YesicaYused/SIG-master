import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponTypesComponent } from './weapon-types.component';

describe('WeaponTypesComponent', () => {
  let component: WeaponTypesComponent;
  let fixture: ComponentFixture<WeaponTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
