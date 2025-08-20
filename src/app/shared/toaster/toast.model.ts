export interface Toast {
  id: string;
  message: string;
  type: ToastType
  duration?: number;
}

export type ToastType = 'success' | 'error';