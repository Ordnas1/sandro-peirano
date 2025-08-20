import { Toaster } from "./toaster";
import { MockBuilder, MockRender } from "ng-mocks";
import { provideZonelessChangeDetection } from "@angular/core";

describe("Toaster", () => {
  beforeEach(async () =>
    await MockBuilder(Toaster).provide(provideZonelessChangeDetection())
  );

  it("should create", () => {
    const fixture = MockRender(Toaster);
    const component = fixture.point.componentInstance
    expect(component).toBeTruthy();
  });
});
