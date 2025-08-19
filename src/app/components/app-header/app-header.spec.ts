import { AppHeader } from './app-header';
import { MockBuilder, MockRender } from 'ng-mocks';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AppHeader', () => {
  beforeEach(async () => {
    await MockBuilder(AppHeader).provide(provideZonelessChangeDetection())
  });

  it('should create', () => {
    const fixture = MockRender(AppHeader)
    const component = fixture.point.componentInstance
    expect(component).toBeTruthy();
  });
});
