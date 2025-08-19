import { provideZonelessChangeDetection } from "@angular/core";
import { EditProduct } from "./edit-product";
import { MockBuilder, MockRender, ngMocks } from "ng-mocks";
import { ProductServiceAdapter } from "../../services/products/products.service";
import {
  CreateProductResponse,
  Product,
  ProductService,
  UpdateProductResponse,
} from "../../services/products/products";
import { Observable } from "rxjs";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

class MockProductService extends ProductService {
  private productToEdit: Product | undefined;

  getProducts = jest.fn<Observable<Product[]>, []>();
  doesIDExists = jest.fn<Observable<boolean>, [string]>();
  createProduct = jest.fn<Observable<CreateProductResponse>, [Product]>();
  deleteProduct = jest.fn<Observable<unknown>, [string]>();
  updateProduct = jest.fn<Observable<UpdateProductResponse>, [Product]>();
  setProductToEdit = jest.fn<void, [Product]>((product: Product) => {
    this.productToEdit = product;
  });
  getProductToEdit = jest.fn<Product | undefined, []>(() => {
    return this.productToEdit;
  });
}

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
    const productService = ngMocks.get(ProductServiceAdapter);
    jest.spyOn(productService, "getProductToEdit").mockReturnValue(undefined);
    expect(component).toBeTruthy();
  });
});
