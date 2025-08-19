import { provideZonelessChangeDetection } from "@angular/core";
import { EditProduct } from "./edit-product";
import { MockBuilder, MockRender } from "ng-mocks";
import {
  ProductService,
} from "../../services/products/products";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MockProductService } from "../../shared/test/product-service-mocks";



describe("EditProduct", () => {
  beforeEach(async () =>
    await MockBuilder(EditProduct).provide([
      provideZonelessChangeDetection(),
      provideHttpClient(),
      provideHttpClientTesting(),
    ])
      .mock(ProductService, new MockProductService())
  );

  it("should create", () => {
    const fixture = MockRender(EditProduct);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
