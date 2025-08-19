/// <reference types="jest" />
import { Observable, of } from "rxjs";
import { CreateProductResponse, Product, ProductService, UpdateProductResponse } from "../../services/products/products";


export class MockProductService extends ProductService {
  private productToEdit: Product | undefined;

  getProducts = jest.fn<Observable<Product[]>, []>(() => of([]));
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