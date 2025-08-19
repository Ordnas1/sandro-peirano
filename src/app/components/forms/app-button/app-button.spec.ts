import { provideZonelessChangeDetection } from "@angular/core";
import { AppButton } from "./app-button";
import { MockBuilder, MockRender } from "ng-mocks";

describe("AppButton", () => {
  beforeEach(async () =>  await MockBuilder(AppButton).provide(provideZonelessChangeDetection()));

  it("should create", () => {
    const fixture = MockRender(AppButton);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
