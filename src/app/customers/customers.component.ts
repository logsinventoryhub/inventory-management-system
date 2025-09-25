import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CommunicatorService, Customer } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-customers',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    FontAwesomeModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  cookieValue: string = '';
  currentPage = 1;
  faSearch = faSearch;
  customerInterface: Customer[] = [];
  selectedCustomer: Customer = {
    id: 0,
    first_name: '',
    last_name: '',
    phone: '',
    country: '',
    state: '',
    street: '',
    code: '',
    date: '',
    key: 'UPDATE_CUSTOMER',
    message: '',
    token: '',
  };

  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
    this.fetchCustomers();
  }

  openEditModal(customer: Customer): void {
    this.selectedCustomer = {
      ...customer,
      key: 'UPDATE_CUSTOMER',
      token: this.cookieValue,
    }; // deep copy
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
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

  saveChanges(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    console.log(this.selectedCustomer);
    this.communicatorService
      .updateCustomer(this.selectedCustomer)
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
          this.fetchCustomers();
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
    let deleteCustomerData = {
      supplierID: id,
      token: this.cookieValue,
      key: 'DELETE_CUSTOMER',
    };
    this.communicatorService.deleteItem(deleteCustomerData).subscribe({
      next: (res) => {
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        if (res.code === '001') {
          this.customers = this.customers.filter((item) => item.id !== id);
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
