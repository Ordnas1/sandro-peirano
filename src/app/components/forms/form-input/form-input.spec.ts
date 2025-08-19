import { provideZonelessChangeDetection } from '@angular/core';
import { FormInput } from './form-input';
import { MockBuilder, MockRender } from 'ng-mocks';

describe('FormInput', () => {


  beforeEach(async () => {
    await MockBuilder(FormInput).provide(provideZonelessChangeDetection())
  });

  it('should create', () => {
    const fixture = MockRender(FormInput)
    const component = fixture.point.componentInstance
    expect(component).toBeTruthy();
  });
});
