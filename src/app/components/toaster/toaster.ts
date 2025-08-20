import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCheckCircle, 
  faTimesCircle,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { ToasterService } from '../../shared/toaster/toaster';


@Component({
  selector: 'app-toaster',
  imports: [FontAwesomeModule],
  templateUrl: './toaster.html',
  styleUrl: './toaster.scss',

})
export class Toaster {
  faCheckCircle = faCheckCircle
  faTimesCircle = faTimesCircle
  faTimes = faTimes

  private toasterService = inject(ToasterService)
  toasts = this.toasterService.toasts

  closeToast(id: string): void {
    this.toasterService.removeToast(id);
  }

  getToastClass(type: string): string {
    return `toast toast-${type}`;
  }
}
