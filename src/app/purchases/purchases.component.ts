import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommunicatorService, Purchase } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-purchases',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    FontAwesomeModule,
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss',
})
export class PurchasesComponent implements OnInit {
  cookieValue: string;
  purchaseInterface: Purchase[] = [];
  selectedPurchase: Purchase = {
    id: 0,
    product: '',
    supplier: '',
    quantity: 0,
    unit_cost: 0,
    total_cost: 0,
    status: '',
    code: '',
    date: '',
    key: 'UPDATE_PURCHASE',
    message: '',
    token: '',
  };

  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE WEBPAGE LOADS
  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {}
  orders: any[] = [];
  faSearch = faSearch;
  mobileView: boolean = true;

  ngOnInit() {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
    this.fetchPurchaseOrders();
  }

  private fetchPurchaseOrders(): void {
    // A JSON DATA KEY TO FETCH ORDERS
    let fetchOrderData = {
      token: this.cookieValue,
      key: 'GET_PURCHASE_ORDERS',
    };
    this.communicatorService.onSubmitService(fetchOrderData).subscribe({
      next: (res) => {
        this.orders = res.message;
        console.log(this.orders);
        // HIDE LOADER ANIMATION
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err);
        // HIDE LOADER ANIMATION
        this.spinner.hide();
      },
    });
  }

  openEditModal(purchase: Purchase): void {
    this.selectedPurchase = {
      ...purchase,
      key: 'UPDATE_PURCHASE',
      token: this.cookieValue,
    }; // deep copy
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  saveChanges(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    console.log(this.selectedPurchase);
    this.communicatorService
      .updatePurchase(this.selectedPurchase)
      .subscribe((res) => {
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        if (res.code == '001') {
          Swal.fire({
            title: 'Success!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.fetchPurchaseOrders();
          const modalElement = document.getElementById('editModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        } else {
          Swal.fire({
            title: 'Error!',
            text: res.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
  }

  deleteItem(id: number) {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    // A JSON DATA KEY TO FETCH CATEGORIES
    let deletePurchaseData = {
      supplierID: id,
      token: this.cookieValue,
      key: 'DELETE_PURCHASE',
    };
    this.communicatorService.deleteItem(deletePurchaseData).subscribe({
      next: (res) => {
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        if (res.code === '001') {
          this.orders = this.orders.filter((item) => item.id !== id);
          Swal.fire({
            title: 'Success!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: res.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
      error: (err) => {
        console.log(err);
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
