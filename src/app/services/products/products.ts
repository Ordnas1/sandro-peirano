import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export abstract class ProductService {
    abstract getProducts: () => Observable<Product[]>;
}



export type Product = {
    id: string;
    name: string;
    description: string;
    releaseDate: string;
    restructuringDate?: string;
    logoUrl: string;
}

export type ProductResponse = {
    data: {
        id: string;
        name: string;
        description: string;
        date_release: string;
        date_revision?: string;
        logo: string;
    }[]
}