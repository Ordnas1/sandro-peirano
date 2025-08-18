import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { ProductService } from "../../services/products/products";
import { ProductServiceAdapter } from "../../services/products/products.service";
import { toSignal } from '@angular/core/rxjs-interop';
import { LogoComponent } from "../../components/logo-component/logo-component";
import { SearchBar } from "../../components/search-bar/search-bar";
import { TablePaginator } from "../../components/table-paginator/table-paginator";
import { InitialPaginatorState, PaginatorEvent, PaginatorState } from "../../components/table-paginator/paginator";


@Component({
  selector: "app-home-view",
  imports: [FontAwesomeModule, LogoComponent, SearchBar, TablePaginator],
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
  filterKeyword = signal("");
  
  numberOfFilteredProducts = signal<number>(0);
  paginatorState = signal<PaginatorState>(InitialPaginatorState);
  displayedProducts = computed(() => {
    const keyword = this.filterKeyword();
    const filteredProducts = this.filterProductsByKeyword(keyword);
    
    const paginationParams = this.paginatorState() 

    const paginatedProducts = filteredProducts.slice(
      paginationParams.pageIndex * paginationParams.pageSize,
      (paginationParams.pageIndex + 1) * paginationParams.pageSize
    );
    return paginatedProducts;
  })
  numberOfFilteredItems = computed(() => {
    return this.filterProductsByKeyword(this.filterKeyword()).length;
  })

  totalDisplayedProducts = computed(() => this.displayedProducts().length);


  protected readonly tableHeaders = [
    "Logo",
    "Nombre del producto",
    "Descripción",
    "Fecha de liberación",
    "Fecha de reestructuración",
  ] as const;

  handleInputChange = (value: string) => {
    this.resetPaginator();
    this.filterKeyword.set(value)
  };
  handlePaginationChange = (event: PaginatorEvent) => {
    this.paginatorState.set(event);
  }

  private filterProductsByKeyword = (keyword: string) => {
    return this.products().filter(product =>
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private resetPaginator = () => {
    this.paginatorState.update((val)=> ({
      ...val,
      ...InitialPaginatorState
    }));
  }
}
