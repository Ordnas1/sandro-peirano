import { provideZonelessChangeDetection } from '@angular/core';
import { HomeViewComponent } from './home-view'; 
import { MockBuilder, MockRender } from "ng-mocks"
import { ProductService } from '../../services/products/products';
import { MockProductService } from '../../shared/test/product-service-mocks';

describe("HomeView", () => {
    beforeEach(async() => await MockBuilder(HomeViewComponent).provide(provideZonelessChangeDetection()).mock(ProductService, new MockProductService()))


      it("should create", () => {
        const fixture = MockRender(HomeViewComponent);
        const component = fixture.point.componentInstance;
        expect(component).toBeTruthy();
      });
})