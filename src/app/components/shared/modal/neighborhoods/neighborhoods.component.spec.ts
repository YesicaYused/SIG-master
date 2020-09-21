import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodsComponent } from './neighborhoods.component';

describe('NeighborhoodsComponent', () => {
  let component: NeighborhoodsComponent;
  let fixture: ComponentFixture<NeighborhoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeighborhoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighborhoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
