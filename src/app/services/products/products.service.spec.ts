import { MockBuilder, MockRender, ngMocks } from "ng-mocks";
import { ProductServiceAdapter } from "./products.service";
import { provideHttpClient } from "@angular/common/http";
import {
    HttpTestingController,
    provideHttpClientTesting,
} from "@angular/common/http/testing";
import { environment } from "../../../environments/environment";
import { provideZonelessChangeDetection } from "@angular/core";

const API_URL = environment.apiUrl;

describe("ProductsService", () => {
    beforeEach(() =>
        MockBuilder(ProductServiceAdapter).provide(
            [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        )
    );

    it("should fetch the products", () => {
        MockRender();
        const service = ngMocks.findInstance(ProductServiceAdapter);
        const httpMock = ngMocks.findInstance(HttpTestingController);
        const mockResponse = {
            data: [
                {
                    id: "1",
                    name: "Product 1",
                    logo: "logo1.png",
                    date_release: "2023-01-01",
                    date_revision: "2023-06-01",
                    description: "Description of Product 1",
                },
                {
                    id: "2",
                    name: "Product 2",
                    logo: "logo2.png",
                    date_release: "2023-02-01",
                    date_revision: "2023-07-01",
                    description: "Description of Product 2",
                },
            ],
        };

        const expectedProducts = [
            {
                id: "1",
                name: "Product 1",
                description: "Description of Product 1",
                releaseDate: "2023-01-01",
                revisionDate: "2023-06-01",
                logoUrl: `${API_URL}/logo1.png`,
            },
            {
                id: "2",
                name: "Product 2",
                description: "Description of Product 2",
                releaseDate: "2023-02-01",
                revisionDate: "2023-07-01",
                logoUrl: `${API_URL}/logo2.png`,
            },
        ];

        let actual: unknown;
        service.getProducts().subscribe((data) => actual = data);

        const req = httpMock.expectOne(`${API_URL}/products`);
        expect(req.request.method).toBe("GET");
        req.flush(mockResponse);
        httpMock.verify();

        expect(actual).toEqual(expectedProducts);
    });

    it("should check if ID exists", () => {
        MockRender();
        const service = ngMocks.findInstance(ProductServiceAdapter);
        const httpMock = ngMocks.findInstance(HttpTestingController);
        const testId = "test-id";

        let actual: unknown;
        service.doesIDExists(testId).subscribe((data) => actual = data);

        const req = httpMock.expectOne(
            `${API_URL}/products/verification/${testId}`,
        );
        expect(req.request.method).toBe("GET");
        req.flush(true);
        httpMock.verify();

        expect(actual).toBe(true);
    });

    it("should create a product", () => {
        MockRender();
        const service = ngMocks.findInstance(ProductServiceAdapter);
        const httpMock = ngMocks.findInstance(HttpTestingController);

        const testProduct = {
            id: "test-id",
            name: "Test Product",
            description: "Test Description",
            logoUrl: "test-logo.png",
            releaseDate: "2023-01-01",
            revisionDate: "2023-06-01",
        };

        const mockResponse = {
            message: "Product created successfully",
            data: {
                id: "test-id",
                name: "Test Product",
                description: "Test Description",
                logo: "test-logo.png",
                date_release: "2023-01-01",
                date_revision: "2023-06-01",
            },
        };

        let actual: unknown;
        service.createProduct(testProduct).subscribe((data) => actual = data);

        const req = httpMock.expectOne(`${API_URL}/products`);
        expect(req.request.method).toBe("POST");
        expect(req.request.body).toEqual({
            id: "test-id",
            name: "Test Product",
            logo: "test-logo.png",
            description: "Test Description",
            date_release: "2023-01-01",
            date_revision: "2023-06-01",
        });
        req.flush(mockResponse);
        httpMock.verify();

        expect(actual).toEqual(mockResponse);
    });

    it("should delete a product", () => {
        MockRender();
        const service = ngMocks.findInstance(ProductServiceAdapter);
        const httpMock = ngMocks.findInstance(HttpTestingController);
        const testId = "test-id";

        let actual: unknown;
        service.deleteProduct(testId).subscribe((data) => actual = data);

        const req = httpMock.expectOne(`${API_URL}/products/${testId}`);
        expect(req.request.method).toBe("DELETE");
        req.flush({});
        httpMock.verify();

        expect(actual).toEqual({});
    });

    it("should update a product", () => {
        MockRender();
        const service = ngMocks.findInstance(ProductServiceAdapter);
        const httpMock = ngMocks.findInstance(HttpTestingController);

        const testProduct = {
            id: "test-id",
            name: "Updated Product",
            description: "Updated Description",
            logoUrl: "updated-logo.png",
            releaseDate: "2023-01-01",
            revisionDate: "2023-06-01",
        };

        const mockResponse = {
            message: "Product updated successfully",
            data: {
                name: "Updated Product",
                description: "Updated Description",
                logo: "updated-logo.png",
                date_release: "2023-01-01",
                date_revision: "2023-06-01",
            },
        };

        let actual: unknown;
        service.updateProduct(testProduct).subscribe((data) => actual = data);

        const req = httpMock.expectOne(`${API_URL}/products/${testProduct.id}`);
        expect(req.request.method).toBe("PUT");
        expect(req.request.body).toEqual({
            name: "Updated Product",
            logo: "updated-logo.png",
            description: "Updated Description",
            date_release: "2023-01-01",
            date_revision: "2023-06-01",
        });
        req.flush(mockResponse);
        httpMock.verify();

        expect(actual).toEqual(mockResponse);
    });
    it("should set product to edit in sessionStorage", () => {
        MockRender();
        const service = ngMocks.findInstance(ProductServiceAdapter);
        const testProduct = {
            id: "test-id",
            name: "Test Product",
            description: "Test Description",
            logoUrl: "test-logo.png",
            releaseDate: "2023-01-01",
            revisionDate: "2023-06-01",
        };

        const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

        service.setProductToEdit(testProduct);

        expect(setItemSpy).toHaveBeenCalledWith(
            "productToEdit",
            JSON.stringify(testProduct),
        );
    });

    it("should get product to edit from sessionStorage", () => {
        MockRender();
        const service = ngMocks.findInstance(ProductServiceAdapter);
        const testProduct = {
            id: "test-id",
            name: "Test Product",
            description: "Test Description",
            logoUrl: "test-logo.png",
            releaseDate: "2023-01-01",
            revisionDate: "2023-06-01",
        };

        const getItemSpy = jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValue(JSON.stringify(testProduct));

        const result = service.getProductToEdit();

        expect(getItemSpy).toHaveBeenCalledWith("productToEdit");
        expect(result).toEqual(testProduct);
    });

    it("should handle empty sessionStorage when getting product to edit", () => {
        MockRender();
        const service = ngMocks.findInstance(ProductServiceAdapter);

        const getItemSpy = jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValue(null);

        expect(() => service.getProductToEdit()).toThrow();
        expect(getItemSpy).toHaveBeenCalledWith("productToEdit");
    });
});
