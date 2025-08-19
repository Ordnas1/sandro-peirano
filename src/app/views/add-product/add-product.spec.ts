import { AddProduct } from './add-product';
import { MockBuilder, MockRender } from 'ng-mocks';
import { provideZonelessChangeDetection } from '@angular/core';
import { ProductServiceAdapter } from '../../services/products/products.service';

describe('AddProduct', () => {
  beforeEach(async () => {
   await MockBuilder(AddProduct).provide([provideZonelessChangeDetection()]).mock(ProductServiceAdapter)
  });

  it('should create', () => {
    const fixture = MockRender(AddProduct)
    const component = fixture.point.componentInstance
    expect(component).toBeTruthy();
  });
});
