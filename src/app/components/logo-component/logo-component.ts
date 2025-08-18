import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo-component.html',
  styleUrls: ['./logo-component.scss']
})
export class LogoComponent {
  @Input() imageUrl: string = '';
  @Input() size: number = 50; // default size in pixels
  @Input() fallbackText: string = 'LG';
  
  imageLoadError: boolean = false;

  onImageError() {
    this.imageLoadError = true;
  }

  onImageLoad() {
    this.imageLoadError = false;
  }
}