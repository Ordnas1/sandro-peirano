import { Component, computed, inject, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faEdit,
  faEllipsisVertical,
  faMoneyBillWave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Product,
  ProductRow,
  ProductService,
} from "../../services/products/products";
import { ProductServiceAdapter } from "../../services/products/products.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { LogoComponent } from "../../components/logo-component/logo-component";
import { SearchBar } from "../../components/search-bar/search-bar";
import { TablePaginator } from "../../components/table-paginator/table-paginator";
import {
  InitialPaginatorState,
  PaginatorEvent,
  PaginatorState,
} from "../../components/table-paginator/paginator";
import { Router, RouterLink } from "@angular/router";
import { AppModal } from "../../components/app-modal/app-modal";
import { catchError, of, startWith, Subject, switchMap, take } from "rxjs";
import { AppButton } from "../../components/forms/app-button/app-button";
import { ToasterService } from "../../shared/toaster/toaster";

@Component({
  selector: "app-home-view",
  imports: [
    FontAwesomeModule,
    LogoComponent,
    SearchBar,
    TablePaginator,
    RouterLink,
    AppModal,
    AppButton,
  ],
  templateUrl: "./home-view.html",
  styleUrl: "./home-view.scss",
  providers: [{
    provide: ProductService,
    useClass: ProductServiceAdapter,
  }],
})
export class HomeViewComponent {
  faMoneyBillWave = faMoneyBillWave;
  faEllipsisVertical = faEllipsisVertical;
  faEdit = faEdit;
  faTrash = faTrash;

  private productService = inject(ProductService);
  private router = inject(Router);
  private toasterService = inject(ToasterService);

  private refreshProductFetch$ = new Subject<void>();
  products = toSignal(
    this.refreshProductFetch$.pipe(
      startWith(null),
      switchMap(() => this.productService.getProducts()),
      catchError(() => {
        this.toasterService.showError(
          "Un error a ocurrido a la hora de cargar los productos",
        );
        return of([]);
      }),
    ),
    { initialValue: [] },
  );
  filterKeyword = signal("");

  numberOfFilteredProducts = signal<number>(0);
  paginatorState = signal<PaginatorState>(InitialPaginatorState);

  isModalOpen = signal<boolean>(false);
  productToDelete = signal<ProductRow | null>(null);

  displayedProducts = computed<ProductRow[]>(() => {
    const keyword = this.filterKeyword();
    const filteredProducts = this.filterProductsByKeyword(keyword);

    const paginationParams = this.paginatorState();

    const paginatedProducts = filteredProducts.slice(
      paginationParams.pageIndex * paginationParams.pageSize,
      (paginationParams.pageIndex + 1) * paginationParams.pageSize,
    );
    return paginatedProducts;
  });
  numberOfFilteredItems = computed(() => {
    return this.filterProductsByKeyword(this.filterKeyword()).length;
  });

  totalDisplayedProducts = computed(() => this.displayedProducts().length);

  protected readonly tableHeaders = [
    "Logo",
    "Nombre del producto",
    "Descripción",
    "Fecha de liberación",
    "Fecha de reestructuración",
    "",
  ] as const;

  openDropdownId = signal<string | null>(null);
  toggleDropdown = (productId: string) => {
    const currentId = this.openDropdownId();
    this.openDropdownId.set(currentId === productId ? null : productId);
  };

  closeDropdown = () => {
    this.openDropdownId.set(null);
  };

  isDropdownOpen = (productId: string): boolean => {
    return this.openDropdownId() === productId;
  };

  onDeleteAction = (product: ProductRow) => {
    this.closeDropdown();
    this.productToDelete.set(product);
    this.isModalOpen.set(true);
  };

  onUpdateAction = (product: Product) => {
    this.closeDropdown();
    this.productService.setProductToEdit(product);
    console.log("prod in hv", this.productService.getProductToEdit());
    this.router.navigate([`/editar_producto/${product.id}`]);
  };

  onCloseModal = () => {
    console.log("us this closeing");
    this.isModalOpen.set(false);
  };

  handleInputChange = (value: string) => {
    this.resetPaginator();
    this.filterKeyword.set(value);
  };
  handlePaginationChange = (event: PaginatorEvent) => {
    this.paginatorState.set(event);
  };

  deleteProduct() {
    if (!this.productToDelete()?.id) {
      console.warn("ID not found in product to delete");
    }
    this.isModalOpen.set(false);
    this.productService.deleteProduct(this.productToDelete()?.id as string)
      .pipe(take(1)).subscribe({
        next: () => {
          this.toasterService.showSuccess("El producto ha sido eliminado con exito")
          this.refreshProductFetch$.next();
        },
        error: () => {
          this.toasterService.showError("Hubo un problema a la hora de eliminar el producto")
        }
      });
  }

  private filterProductsByKeyword = (keyword: string) => {
    return this.products().filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  private resetPaginator = () => {
    this.paginatorState.update((val) => ({
      ...val,
      ...InitialPaginatorState,
    }));
  };
}
