import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newproduct',
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
  ],
  templateUrl: './newproduct.component.html',
  styleUrl: './newproduct.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewproductComponent implements OnInit {
  cookieValue: string;
  productName: string = '';
  categories: any[] = [];
  suppliers: any[] = [];
  locations: any[] = [];
  vat: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  excelData: any[];
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
    // SHOW LOADER ANIMATION
    this.spinner.show();

    // A JSON DATA KEY TO FETCH CATEGORIES
    /*let fetchCategoryData = {
      token: this.cookieValue,
      key: "GET_CATEGORIES"
    }
    this.communicatorService.onSubmitService(fetchCategoryData).subscribe({
      next: (res) => {
        this.categories = res.message
        console.log(this.categories)
        // HIDE LOADER ANIMATION
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err)
        // HIDE LOADER ANIMATION
        this.spinner.hide();
      }
    })*/
  }

  ngOnInit(): void {
    this.communicatorService.data$.subscribe((data) => {
      this.categories = data.categories?.message || {};
      this.locations = data.locations?.message || {};
      console.log(data);
    });

    this.fetchSuppliers();
  }

  private fetchSuppliers(): void {
    // A JSON DATA KEY TO FETCH SUPPLIERS
    let fetchSupplierData = {
      token: this.cookieValue,
      key: 'GET_SUPPLIERS',
    };
    this.communicatorService.onSubmitService(fetchSupplierData).subscribe({
      next: (res) => {
        this.suppliers = res.message;
        console.log(this.suppliers);
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

  private _formBuilder = inject(FormBuilder);

  // FRONT END VALIDATION FOR NEW PRODUCT INPUTS
  AddNewProductFormGroup = this._formBuilder.group({
    productName: ['', Validators.required],
    productCategory: ['', Validators.required],
    productAmount: ['', Validators.required],
    productQuantity: ['', Validators.required],
    productStockAlert: ['', Validators.required],
    productManufacturer: ['', Validators.required],
    productSupplier: ['', Validators.required],
    productDetail: ['', Validators.required],
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // LOGS ADD PRODUCT METHOD
  addNewProduct(newProductData: NgForm) {
    this.spinner.show();

    const formData = new FormData();

    // Append form fields
    formData.append('name', newProductData.value.name);
    formData.append('category', newProductData.value.category);
    formData.append('cost_price', newProductData.value.cost_price);
    formData.append('price', newProductData.value.price);
    formData.append('discount_price', newProductData.value.discount_price);
    formData.append('stock_alert', newProductData.value.stock_alert);
    formData.append('description', newProductData.value.description);
    formData.append('vat', this.vat ? '1' : '0');
    formData.append('token', this.cookieValue);
    formData.append('key', 'ADD_NEW_PRODUCT');

    // Append file if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.communicatorService.onSubmitFormData(formData).subscribe({
      next: (res) => {
        console.log(res);
        const alertType = res.code === '001' ? 'success' : 'error';
        this.showAlert(
          alertType === 'success' ? 'Success!' : 'Error!',
          res.message,
          alertType
        );

        this.spinner.hide();

        if (res.code === '001') {
          this.router.navigate(['/dashboard/products']);
        }
      },
      error: (err) => {
        console.log(err);
        this.spinner.hide();
      },
    });
  }

  // METHOD TO CONVERT SPREADSHEET DATA TO JSON
  onFileChange(event: any) {
    // GET SPREADSHEET FILE DATA
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      // CONERT DATA TO JSON AND STORE THE RESULT IN THE SPREADSHEET DATA ARRAY VARIABLE
      this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log('Excel data:', this.excelData);
    };
    reader.readAsArrayBuffer(file);
  }

  // LOGS ADD PRODUCT METHOD
  addNewProductFromSpreadSheet() {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    // NEW PRODUCT INPUT DATA
    let newProductJSONData = {
      product: this.excelData,
      token: this.cookieValue,
      key: 'ADD_NEW_SPREADSHEET_PRODUCT',
    };
    this.communicatorService.onSubmitService(newProductJSONData).subscribe({
      next: (res) => {
        console.log(res);
        const alertType = res.code === '001' ? 'success' : 'error';
        this.showAlert(
          alertType === 'success' ? 'Success!' : 'Error!',
          res.message,
          alertType
        );
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        if (res.code === '001') {
          this.router.navigate(['/dashboard/products']);
        }

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

  private showAlert(
    title: string,
    text: string,
    icon: 'success' | 'error'
  ): void {
    Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
  }
}
