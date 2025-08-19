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
import { Subject, take, takeUntil } from "rxjs";
import { addYears, format } from "date-fns"; // TODO encapsulate in service
import { Router } from "@angular/router";
import { AppButton } from "../../components/forms/app-button/app-button";
import { minDateValidator } from "../../components/forms/validators/date-validators";

@Component({
  selector: "app-edit-product",
  imports: [FormInput, ReactiveFormsModule, AppButton],
  templateUrl: "./edit-product.html",
  styleUrl: "./edit-product.scss",
  providers: [{provide: ProductService, useClass: ProductServiceAdapter}],
})
export class EditProduct implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private router = inject(Router);

  productForm = new FormGroup({
    id: new FormControl({ value: "", disabled: true }, {}),
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
      minDateValidator(new Date())
    ]),
    revisionDate: new FormControl({ value: "", disabled: true }, [
      Validators.required,
    ]),
  });

  private terminator = new Subject<void>();

  // Valor para limitar datepicker
  minDate = format(new Date(), 'yyyy-MM-dd') 

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

    this.resetFormValuesToStoredUpdateObject()
  }

  ngOnDestroy = () => {
    this.terminator.next();
    this.terminator.complete();
  }

  resetForm = () => {
    this.resetFormValuesToStoredUpdateObject()
  }

  onSubmit = () => {
    if (this.productForm.valid) {
      const product = {
        id: this.productForm.getRawValue().id,
        name: this.productForm.getRawValue().name,
        description: this.productForm.getRawValue().description,
        logoUrl: this.productForm.getRawValue().logo,
        releaseDate: this.productForm.getRawValue().releaseDate,
        revisionDate: this.productForm.getRawValue().revisionDate,
      } as Product;

      this.productService.updateProduct(product).pipe(take(1)).subscribe(() =>
        this.router.navigate([""])
      );
    } else {
      console.warn("Form is invalid");
    }
  }

  private resetFormValuesToStoredUpdateObject = () => {
    const product = this.productService.getProductToEdit();
    if (!product) return;

    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logoUrl,
      releaseDate: product.releaseDate,
      revisionDate: product.revisionDate ?? "",
    });
  }
}
