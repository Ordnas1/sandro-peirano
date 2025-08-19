import { Component, input, output, computed } from '@angular/core';

type ButtonVariant = "primary" | "secondary"

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './app-button.html',
  styleUrl: './app-button.scss'
})
export class AppButton {
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  
  clicked = output<void>();
  buttonClasses = computed(() => `button ${this.variant()}-button`);
  

  protected handleClick() {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
