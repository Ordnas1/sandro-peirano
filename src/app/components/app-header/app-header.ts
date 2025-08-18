import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss'
})
export class AppHeader {
  faMoneyBillWave = faMoneyBillWave;
}
