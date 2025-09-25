import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newtransfer',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    CommonModule,
    NgxSpinnerModule,
    RouterModule,
    NgSelectModule,
  ],
  templateUrl: './newtransfer.component.html',
  styleUrl: './newtransfer.component.scss',
})
export class NewtransferComponent implements OnInit {
  cookieValue: string;
  warehouses: any[] = [];
  products: any[] = [];
  to_id: number | null = null;
  from_id: number | null = null;
  product_id: number | null = null;
  users: any[] = [];
  assigned_user_id: number | null = null;
  transfer_status: string | null = null;

  status = [
    { id: 0, name: 'pending' },
    { id: 1, name: 'completed' },
  ];

  private _snackBar = inject(MatSnackBar);

  // NOTIFICATION SNACKBAR METHOD
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE WEBPAGE LOADS
  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
  }

  /**
   * ON INITIALIZATION METHOD
   */
  ngOnInit(): void {
    this.fetchProducts();
    this.fetchWarehouses();
    this.fetchUsers();
  }

  private fetchProducts(): void {
    // A JSON DATA KEY TO FETCH PRODUCTS
    let fetchProductData = {
      token: this.cookieValue,
      key: 'GET_PRODUCTS',
    };
    this.spinner.show();
    this.communicatorService.onSubmitService(fetchProductData).subscribe({
      next: (res) => {
        this.products = res.message;
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

  private fetchWarehouses(): void {
    const payload = {
      token: this.cookieValue,
      key: 'GET_ADDRESSES',
    };

    this.spinner.show();

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.warehouses = res?.message || [];
        console.log('Fetched warehouses:', this.warehouses);
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error fetching warehouses:', err);
        this.spinner.hide();
      },
    });
  }

  private fetchUsers(): void {
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

  // LOGS ADD TRANSFER METHOD
  addNewTransfer(newTransferData: NgForm) {
    // SHOW LOADER ANIMATION
    this.spinner.show();

    // NEW TRANSFER INPUT DATA
    let newTransferJSONData = {
      product: this.product_id,
      quantity: newTransferData.value.quantity,
      from_address: this.from_id,
      to_address: this.to_id,
      assigned_to: newTransferData.value.assigned_to,
      transfer_status: this.transfer_status,
      token: this.cookieValue,
      key: 'ADD_NEW_TRANSFER',
    };
    this.communicatorService.onSubmitService(newTransferJSONData).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res.message || 'Successful.',
          timer: 5000, // 5 seconds
          timerProgressBar: true,
          showConfirmButton: true,
        });
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        if (res.code === '001') {
          this.router.navigate(['/dashboard/transfers']);
        }
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err || 'Something went wrong.',
          timer: 5000, // 5 seconds
          timerProgressBar: true,
          showConfirmButton: true,
        });
        // HIDE LOADER ANIMATION
        this.spinner.hide();
      },
    });
  }
}
