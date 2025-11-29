import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarProduct } from './car-product';

describe('CarProduct', () => {
  let component: CarProduct;
  let fixture: ComponentFixture<CarProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(CarProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
