import { AppModal } from "./app-modal";
import { MockBuilder, MockRender } from "ng-mocks";
import { provideZonelessChangeDetection } from "@angular/core";

describe("AppModal", () => {
  beforeEach(async () =>
    await MockBuilder(AppModal).provide(provideZonelessChangeDetection())
  );

  it("should create", () => {
    const fixture = MockRender(AppModal);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
