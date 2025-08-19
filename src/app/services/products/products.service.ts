import { inject, Injectable } from "@angular/core";
import { CreateProductResponse, Product, ProductResponse, ProductService } from "./products";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class ProductServiceAdapter implements ProductService {
    private readonly apiUrl = environment.apiUrl;
    http = inject(HttpClient);

    getProducts = (): Observable<Product[]> =>
        this.http.get<ProductResponse>(`${this.apiUrl}/products`).pipe(
            map((res: ProductResponse) =>
                res.data.map((item) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    logoUrl: `${this.apiUrl}/${item.logo}`,
                    releaseDate: item.date_release,
                    revisionDate: item.date_revision,
                }))
            ),
        );
    
    doesIDExists = (id: string) => 
        this.http.get<boolean>(`${this.apiUrl}/products/verification/${id}`)

    createProduct = (payload:Product) =>
        this.http.post<CreateProductResponse>(`${this.apiUrl}/products`, {
            id: payload.id,
            name: payload.name,
            logo: payload.logoUrl,
            description: payload.description,
            date_release: payload.releaseDate,
            date_revision: payload.revisionDate
        })
}
