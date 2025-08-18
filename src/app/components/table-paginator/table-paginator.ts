import { Component, computed, input, output } from "@angular/core";
import { InitialPaginatorState, PaginatorEvent } from "./paginator";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-table-paginator",
  imports: [FontAwesomeModule],
  templateUrl: "./table-paginator.html",
  styleUrl: "./table-paginator.scss",
})
export class TablePaginator {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  numberOfItems = input.required<number>();
  pageSizeOptions = input<number[]>([5, 10, 20]);
  pageIndex = input<number>(0);
  pageSize = input<number>(InitialPaginatorState.pageSize);

  paginationChange = output<PaginatorEvent>();

  disableNextPage = computed<boolean>(() =>
    (this.pageIndex() + 1) * this.pageSize() >= this.numberOfItems()
  );
  disablePreviousPage = computed<boolean>(() => this.pageIndex() === 0);

  startDisplayedIndex = computed<number>(() =>
    this.pageIndex() * this.pageSize() + 1
  );
  endDisplayedIndex = computed<number>(() => {
    const endIndex = (this.pageIndex() + 1) * this.pageSize();
    return endIndex > this.numberOfItems() ? this.numberOfItems() : endIndex;
  });

  onPaginationChange = (ev: PaginatorEvent) => {
    this.paginationChange.emit(ev);
  };

  onNextPage = () => {
    if (!this.disableNextPage()) {
      this.onPaginationChange({
        totalItems: this.numberOfItems(),
        pageIndex: this.pageIndex() + 1,
        pageSize: this.pageSize(),
      });
    }
  };

  onPreviousPage = () => {
    if (!this.disablePreviousPage()) {
      this.onPaginationChange({
        totalItems: this.numberOfItems(),
        pageIndex: this.pageIndex() - 1,
        pageSize: this.pageSize(),
      });
    }
  };

  onSelectPageSize = (event: Event) => {
    const selectElement = event.target as HTMLSelectElement;
    const size = parseInt(selectElement.value, 10);
    if (this.pageSizeOptions().includes(size)) {
      this.onPaginationChange({
        totalItems: this.numberOfItems(),
        pageIndex: 0,
        pageSize: size,
      });
    }
  };
}
