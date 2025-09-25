import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommunicatorService, Sale } from '../communicator.service';
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
  selector: 'app-orders',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    CommonModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    FormsModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  cookieValue: string;
  salesInterface: Sale[] = [];
  selectedSale: Sale = {
    id: 0,
    product: '',
    customer: '',
    quantity_sold: 0,
    unit_price: 0,
    total_price: 0,
    assigned_to: '',
    payment_status: '',
    status: '',
    code: '',
    date: '',
    key: 'UPDATE_SALE',
    message: '',
    token: '',
  };
  products: any[];
  customers: any[];
  users: any[];

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
    this.fetchSales();
    this.loadProducts();
    this.fetchCustomers();
    this.fetchUsers();
  }

  private fetchSales(): void {
    // A JSON DATA KEY TO FETCH ORDERS
    let fetchOrderData = {
      token: this.cookieValue,
      key: 'GET_SALES_ORDERS',
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

  private loadProducts(): void {
    this.spinner.show();
    const fetchProductData = {
      token: this.cookieValue,
      key: 'GET_PRODUCTS',
    };
    this.communicatorService.onSubmitService(fetchProductData).subscribe({
      next: (res) => {
        this.products = res.message;
        this.spinner.hide();
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      },
    });
  }

  private fetchCustomers(): void {
    const payload = {
      token: this.cookieValue,
      key: 'GET_CUSTOMERS',
    };

    this.spinner.show();

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.code === '001') {
          this.customers = res?.message || [];
          console.log('Fetched customers:', this.customers);
        } else {
          console.log(res.message);
          this.customers = [];
        }
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.spinner.hide();
      },
    });
  }
  private fetchUsers(): void {
    if (this.cookieValue) {
      const API_JSON_DATA = {
        token: this.cookieValue,
        key: 'GET_USERS_DATA',
      };
      this.communicatorService.onSubmitService(API_JSON_DATA).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.users = res.users;
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error fetching users data:', err);
        },
      });
    }
  }

  openEditModal(sale: Sale): void {
    this.selectedSale = {
      ...sale,
      key: 'UPDATE_SALE',
      token: this.cookieValue,
    }; // deep copy
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  saveChanges(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    console.log(this.selectedSale);
    this.communicatorService.updateSale(this.selectedSale).subscribe((res) => {
      // HIDE LOADER ANIMATION
      this.spinner.hide();
      if (res.code == '001') {
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.fetchSales();
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

  deleteItem(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This order will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        const deleteProductData = {
          id: id,
          token: this.cookieValue,
          key: 'DELETE_SALE',
        };
        this.communicatorService.deleteItem(deleteProductData).subscribe({
          next: (res) => {
            this.spinner.hide();
            if (res.code === '001') {
              this.orders = this.orders.filter((item) => item.id !== id);
              this.showAlert('Success!', res.message, 'success');
            } else {
              this.showAlert('Error!', res.message, 'error');
            }
          },
          error: (err) => {
            console.error(err);
            this.spinner.hide();
            this.showAlert('Error!', err.message, 'error');
          },
        });
      }
    });
  }

  private showAlert(
    title: string,
    text: string,
    icon: 'success' | 'error'
  ): void {
    Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
  }
}
