import { Component, effect, input, output, signal } from "@angular/core";
import { AppButton } from "../forms/app-button/app-button";

@Component({
  selector: "app-modal",
  imports: [AppButton],
  templateUrl: "./app-modal.html",
  styleUrl: "./app-modal.scss",
})
export class AppModal {
  isOpen = input<boolean>(false);

  closeModal = output<void>();
  successAction = output<void>();

  isAnimating = signal(false);

  constructor() {
    // Effect to handle animations when modal opens/closes
    effect(() => {
      if (this.isOpen()) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }

  close() {
    this.closeModal.emit();
  }

  onOverlayClick = (event: Event) => {
    console.log("what", event.target, event.currentTarget)
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.close();
    }
  }

  onSuccess = () => {
    this.successAction.emit()
  }
}
