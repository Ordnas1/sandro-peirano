import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBar {
  inputChange = output<string>()

  onInputChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    this.inputChange.emit(inputElement.value);
  };
}
