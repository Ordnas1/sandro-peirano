import { Observable } from "rxjs";

export abstract class ProductService {
    abstract getProducts: () => Observable<Product[]>;
    abstract doesIDExists: (id: string) => Observable<boolean>;
    abstract createProduct: (
        payload: Product,
    ) => Observable<CreateProductResponse>;
}

export interface CreateProductResponse {
    message: string;
    data: {
        id: string;
        name: string;
        description: string;
        logo: string;
        date_release: string;
        date_revision: string;
    };
}

export interface Product {
    id: string;
    name: string;
    description: string;
    releaseDate: string;
    revisionDate?: string;
    logoUrl: string;
}

export interface ProductResponse {
    data: {
        id: string;
        name: string;
        description: string;
        date_release: string;
        date_revision: string;
        logo: string;
    }[];
}
