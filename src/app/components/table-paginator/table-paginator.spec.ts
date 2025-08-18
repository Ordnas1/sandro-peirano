import { TablePaginator } from './table-paginator';
import { provideZonelessChangeDetection } from '@angular/core';
import { MockBuilder, MockRender } from 'ng-mocks';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('TablePaginator', () => {

  beforeEach(async () => MockBuilder(TablePaginator).provide(
    provideZonelessChangeDetection()
  ).keep(FontAwesomeModule));

  it('should create', () => {
    const fixture = MockRender(TablePaginator, {numberOfItems: 100});
    const component = fixture.point.componentInstance;


    expect(component).toBeTruthy();
  });
});
