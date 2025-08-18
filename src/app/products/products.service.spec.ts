import { MockBuilder, MockRender, ngMocks } from "ng-mocks";
import { ProductServiceAdapter } from "./products.service";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import {
    HttpTestingController,
    provideHttpClientTesting,
} from "@angular/common/http/testing";
import { environment } from "../../environments/environment";
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
                restructuringDate: "2023-06-01",
                logoUrl: `${API_URL}/logo1.png`,
            },
            {
                id: "2",
                name: "Product 2",
                description: "Description of Product 2",
                releaseDate: "2023-02-01",
                restructuringDate: "2023-07-01",
                logoUrl: `${API_URL}/logo2.png`,
            },
        ]

        let actual: unknown;
        service.getProducts().subscribe((data) => actual = data);

        const req = httpMock.expectOne(`${API_URL}/products`);
        expect(req.request.method).toBe("GET");
        req.flush(mockResponse);
        httpMock.verify();

        expect(actual).toEqual(expectedProducts);
    });
});
