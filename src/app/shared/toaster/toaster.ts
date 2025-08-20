import { computed, Injectable, signal } from '@angular/core';
import { Toast, ToastType } from './toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
  readonly toastCount = computed(() => this._toasts().length);
  
  readonly activeToastsByType = computed(() => {
    const toasts = this._toasts();
    return {
      success: toasts.filter(t => t.type === 'success').length,
      error: toasts.filter(t => t.type === 'error').length,
    };
  });

  private generateId(): string {
    return crypto.randomUUID();
  }

  private addToast(message: string, type: ToastType, duration = 3000): void {
    const toast: Toast = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    this._toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, duration);
    }
  }

  showSuccess(message: string, duration = 3000): void {
    this.addToast(message, 'success', duration);
  }

  showError(message: string, duration = 5000): void {
    this.addToast(message, 'error', duration);
  }

  removeToast(id: string): void {
    this._toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clearAll(): void {
    this._toasts.set([]);
  }
}
