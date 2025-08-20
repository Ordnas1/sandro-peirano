import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormInput } from "../../components/forms/form-input/form-input";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Product, ProductService } from "../../services/products/products";
import { ProductServiceAdapter } from "../../services/products/products.service";
import { UniqueIDValidator } from "../../components/forms/validators/product-validators";
import { Subject, take, takeUntil } from "rxjs";
import { addYears, format } from "date-fns"; // TODO encapsulate in service
import { Router } from "@angular/router";
import { AppButton } from "../../components/forms/app-button/app-button";
import { minDateValidator } from "../../components/forms/validators/date-validators";
import { ToasterService } from "../../shared/toaster/toaster";

@Component({
  selector: "app-add-product",
  imports: [FormInput, ReactiveFormsModule, AppButton],
  templateUrl: "./add-product.html",
  styleUrl: "./add-product.scss",
  providers: [{
    provide: ProductService,
    useClass: ProductServiceAdapter,
  }],
})
export class AddProduct implements OnInit, OnDestroy {
  private doesIdExist = inject(UniqueIDValidator);
  private productService = inject(ProductService);
  private router = inject(Router);
  private toasterService = inject(ToasterService);

  productForm = new FormGroup({
    id: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10),
      ],
      asyncValidators: [this.doesIdExist.validate.bind(this.doesIdExist)],
      updateOn: "blur",
    }),
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    description: new FormControl("", [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
    logo: new FormControl("", [
      Validators.required,
    ]),
    releaseDate: new FormControl("", [
      Validators.required,
      minDateValidator(new Date()),
    ]),
    revisionDate: new FormControl({ value: "", disabled: true }, [
      Validators.required,
    ]),
  });

  private terminator = new Subject<void>();

  // Valor para limitar datepicker
  minDate = format(new Date(), "yyyy-MM-dd");

  ngOnInit(): void {
    this.productForm.get("releaseDate")?.valueChanges.pipe(
      takeUntil(this.terminator),
    ).subscribe((val) => {
      if (!val) {
        return;
      }
      const nextyear = format(addYears(new Date(val), 1), "yyyy-MM-dd");
      this.productForm.get("revisionDate")?.setValue(nextyear, {
        emitEvent: false,
      });
    });
  }

  ngOnDestroy(): void {
    this.terminator.next();
    this.terminator.complete();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product = {
        id: this.productForm.getRawValue().id,
        name: this.productForm.getRawValue().name,
        description: this.productForm.getRawValue().description,
        logoUrl: this.productForm.getRawValue().logo,
        releaseDate: this.productForm.getRawValue().releaseDate,
        revisionDate: this.productForm.getRawValue().revisionDate,
      } as Product;

      this.productService.createProduct(product).pipe(take(1)).subscribe({
        complete: () => {
          this.toasterService.showSuccess(
            "Producto creado satisfactoriamente",
          );
          this.router.navigate([""]);
        },
        error: () => {
          this.toasterService.showError(
            "Ocurrió un error al momento de crear el producto"
          )
        }
      });
    } else {
      this.toasterService.showError("El formulario tiene valores inválidos")
    }
  }
}
