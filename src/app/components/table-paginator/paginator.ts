export interface PaginatorEvent {
    totalItems: number;
    pageIndex: number;
    pageSize: number;
}

export type PaginatorState = PaginatorEvent

export const InitialPaginatorState: PaginatorState = {
    totalItems: 0,
    pageIndex: 0,
    pageSize: 5,
};