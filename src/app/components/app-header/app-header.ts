import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-header",
  imports: [FontAwesomeModule],
  templateUrl: "./app-header.html",
  styleUrl: "./app-header.scss",
})
export class AppHeader {
  private router = inject(Router);
  faMoneyBillWave = faMoneyBillWave;

  onClickHeader = () => {
    this.router.navigate([""]);
  };
}
