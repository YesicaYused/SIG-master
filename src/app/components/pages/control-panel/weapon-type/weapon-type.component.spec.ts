import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponTypeComponent } from './weapon-type.component';

describe('WeaponTypeComponent', () => {
  let component: WeaponTypeComponent;
  let fixture: ComponentFixture<WeaponTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
