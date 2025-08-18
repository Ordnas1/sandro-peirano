import { Component, inject, OnInit } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { ProductService } from "../../products/products";
import { ProductServiceAdapter } from "../../products/products.service";
import { toSignal } from '@angular/core/rxjs-interop';
import { LogoComponent } from "../../components/logo-component/logo-component";

@Component({
  selector: "app-home-view",
  imports: [FontAwesomeModule, LogoComponent],
  templateUrl: "./home-view.html",
  styleUrl: "./home-view.scss",
  providers: [{
    provide: ProductService,
    useClass: ProductServiceAdapter,
  }],
})
export class HomeViewComponent  {
  faMoneyBillWave = faMoneyBillWave;
  productService = inject(ProductService);
  products = toSignal(this.productService.getProducts(), { initialValue: [] });


  protected readonly tableHeaders = [
    "Logo",
    "Nombre del producto",
    "Descripción",
    "Fecha de liberación",
    "Fecha de reestructuración",
  ] as const;
}
