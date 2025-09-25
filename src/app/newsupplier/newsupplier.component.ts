import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormControl,
  NgForm,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newsupplier',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatIconModule,
    CommonModule,
    NgxSpinnerModule,
  ],
  templateUrl: './newsupplier.component.html',
  styleUrl: './newsupplier.component.scss',
})
export class NewsupplierComponent implements OnInit {
  cookieValue: string;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  categories: any[] = [];
  locations: any[] = [];
  products: any[] = [];
  productName: string = '';
  vat: boolean = false;
  private _snackBar = inject(MatSnackBar);

  // NOTIFICATION SNACKBAR METHOD
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  private _formBuilder = inject(FormBuilder);

  // FRONT END VALIDATION FOR SUPPLIER INPUTS
  AddSupplierFormGroup = this._formBuilder.group({
    supplierName: ['', Validators.required],
    supplierCategory: ['', Validators.required],
    supplierPhoneNumber: ['', Validators.required],
    supplierWebsite: [''],
    supplierProduct: ['', Validators.required],
    orderQuantity: ['', Validators.required],
    orderDeliveryLocation: ['', Validators.required],
    paymentStatus: ['', Validators.required],
  });

  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE WEBPAGE LOADS
  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
  }

  ngOnInit(): void {
    this.communicatorService.data$.subscribe((data) => {
      this.categories = data.categories?.message || {};
      this.locations = data.locations?.message || {};
      console.log(data)
    });
  }

  // CREATE CATEGORY METHOD THAT SENDS CATEGORY DATA TO THE BACKEND FOR PROCESSING INTO THE DATABASE
  addSupplier(supplierData: NgForm) {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    let supplierJSONData = {
      name: supplierData.value.supplierName,
      category: supplierData.value.category,
      email: supplierData.value.supplierEmail,
      phone: supplierData.value.supplierPhoneNumber,
      website: supplierData.value.supplierWebsite,
      //product_category: supplierData.value.productCategory,
      //product: this.productName,
      //price: supplierData.value.price,
      //quantity: supplierData.value.orderQuantity,
      //location: supplierData.value.location,
      //payment_status: supplierData.value.paymentStatus,
      //vat: supplierData.value.vat,
      token: this.cookieValue,
      key: 'ADD_SUPPLIER',
    };
    console.log(supplierJSONData);
    this.communicatorService.onSubmitService(supplierJSONData).subscribe({
      next: (res) => {
        console.log(res);
        const alertType = res.code === '001' ? 'success' : 'error';
        this.showAlert(alertType === 'success' ? 'Success!' : 'Error!', res.message, alertType);
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        if(res.code === '001') {
          this.router.navigate(["/dashboard/suppliers"]);
        }
      },
      error: (err) => {
        console.log(err);
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        this.showAlert('Error!', 'An unexpected error occurred. Please try again.', 'error');
      },
    });
  }

  private showAlert(title: string, text: string, icon: 'success' | 'error'): void {
      Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
    }
}
