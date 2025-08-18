import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo-component.html',
  styleUrls: ['./logo-component.scss']
})
export class LogoComponent {
  @Input() imageUrl = '';
  @Input() size = 50; // default size in pixels
  @Input() fallbackText = 'LG';
  
  imageLoadError = false;

  onImageError() {
    this.imageLoadError = true;
  }

  onImageLoad() {
    this.imageLoadError = false;
  }
}