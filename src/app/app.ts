import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './components/app-header/app-header';
import { Toaster } from './components/toaster/toaster';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('angular-bancoo');
}
