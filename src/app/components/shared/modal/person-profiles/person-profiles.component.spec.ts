import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonProfilesComponent } from './person-profiles.component';

describe('PersonsProfilesComponent', () => {
  let component: PersonProfilesComponent;
  let fixture: ComponentFixture<PersonProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
