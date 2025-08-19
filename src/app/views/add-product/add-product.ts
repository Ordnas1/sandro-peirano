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

@Component({
  selector: "app-add-product",
  imports: [FormInput, ReactiveFormsModule],
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
    ]),
    revisionDate: new FormControl({ value: "", disabled: true }, [
      Validators.required,
    ]),
  });

  private terminator = new Subject<void>();

  ngOnInit(): void {
    this.productForm.get("releaseDate")?.valueChanges.pipe(
      takeUntil(this.terminator),
    ).subscribe((val) => {
      if (!val) {
        return
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

      this.productService.createProduct(product).pipe(take(1)).subscribe((
        _val,
      ) => this.router.navigate([""]));
    } else {
      console.warn("Form is invalid");
    }
  }
}
