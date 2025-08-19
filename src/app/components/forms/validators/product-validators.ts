import { inject, Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator } from "@angular/forms";
import { catchError, map, of } from "rxjs";
import { ProductServiceAdapter } from "../../../services/products/products.service";

@Injectable({providedIn: "root"})
export class UniqueIDValidator implements AsyncValidator {
    private readonly productService = inject(ProductServiceAdapter)

    validate = (control: AbstractControl) => 
        this.productService.doesIDExists(control.value).pipe(
            map((itExists) => (itExists ? {itExists: true}: null)),
            catchError(() => of(null))
        )
    
}