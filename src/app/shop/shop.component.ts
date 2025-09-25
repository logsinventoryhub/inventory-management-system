import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-shop',
    imports: [FontAwesomeModule, MatPaginatorModule, RouterModule, CommonModule, NgxSpinnerModule],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.scss'
})
export class ShopComponent {
  faList = faList;
  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE WEBPAGE LOADS
  constructor(private communicatorService: CommunicatorService, private cookieService: CookieService, private spinner: NgxSpinnerService) {};
  cookieValue: string;
  products: any[] = [];

  ngAfterViewInit() {
    // SHOW LOADER ANIMATION
    //this.spinner.show();
    this.cookieValue = this.cookieService.get("Logs_Cookie_data");

    // A JSON DATA KEY TO FETCH CATEGORIES
    let fetchProductData = {
     token: this.cookieValue,
     key: "fetchProduct"
   }
   this.communicatorService.onSubmitService(fetchProductData).subscribe({
    next: (res) => {
      this.products = res.message
      // HIDE LOADER ANIMATION
      this.spinner.hide();
    },
    error: (err) => {
      console.log(err)
      // HIDE LOADER ANIMATION
      this.spinner.hide();
    }
   })
  }


}
