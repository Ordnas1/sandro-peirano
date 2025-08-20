import { inject, Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator } from "@angular/forms";
import { catchError, map, of } from "rxjs";
import { ProductServiceAdapter } from "../../../services/products/products.service";
import { ToasterService } from "../../../shared/toaster/toaster";

@Injectable({ providedIn: "root" })
export class UniqueIDValidator implements AsyncValidator {
    private readonly productService = inject(ProductServiceAdapter);
    private toasterService = inject(ToasterService);

    validate = (control: AbstractControl) =>
        this.productService.doesIDExists(control.value).pipe(
            map((itExists) => (itExists ? { itExists: true } : null)),
            catchError(() => {
                this.toasterService.showError(
                    "Hubo un error a la hora de verificar la ID del producto",
                );
                return of(null);
            }),
        );
}
