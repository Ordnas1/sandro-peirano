import { Observable } from "rxjs";

export abstract class ProductService {
    abstract getProducts: () => Observable<Product[]>;
    abstract doesIDExists: (id: string) => Observable<boolean>;
    abstract createProduct: (
        payload: Product,
    ) => Observable<CreateProductResponse>;
    abstract deleteProduct: (productId: string) => Observable<unknown>;
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

export interface ProductRow extends Product {
    openDropdown?: boolean
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
