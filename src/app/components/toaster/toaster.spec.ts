import { Toaster } from "./toaster";
import { MockBuilder, MockRender } from "ng-mocks";
import { provideZonelessChangeDetection } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ToasterService } from "../../shared/toaster/toaster";

describe("Toaster", () => {
  beforeEach(async () => {
    await MockBuilder(Toaster).provide(provideZonelessChangeDetection()).keep(
      FontAwesomeModule,
    );
  });

  it("should create", () => {
    const fixture = MockRender(Toaster);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it("should display toasts", () => {
    const fixture = MockRender(Toaster);
    const toasterService = fixture.point.injector.get(ToasterService);

    toasterService.showSuccess("Success!");
    toasterService.showError("Error!");
    fixture.detectChanges()
    const toastMessages = fixture.nativeElement.querySelectorAll(
      '[data-test-id="toast-message"]',
    );

    expect(toastMessages).toHaveLength(2);
    expect(toastMessages[0].textContent.trim()).toBe("Success!");
    expect(toastMessages[1].textContent.trim()).toBe("Error!");
  });
});
