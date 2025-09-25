import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, Inject, inject } from '@angular/core';
import * as XLSX from 'xlsx'
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DOCUMENT } from '@angular/common';
import { HostListener } from "@angular/core";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@HostListener('window:resize', ['$event'])

@Component({
  selector: 'app-productspreadsheet',
  imports: [CommonModule, RouterModule, FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ReactiveFormsModule,
  NgxSpinnerModule],
  templateUrl: './productspreadsheet.component.html',
  styleUrl: './productspreadsheet.component.scss'
})
export class ProductspreadsheetComponent implements OnInit {
  cookieValue: string;
  public data: object[] = [];
  //SPREADSHEET DATA ARRAY VARIABLE
  excelData: any[];
  isDisable: boolean = true;
  mobileView: boolean = true
  private doc: Document;

  constructor(private communicatorService: CommunicatorService, private cookieService: CookieService, @Inject(DOCUMENT) doc: any, private router: Router, private spinner: NgxSpinnerService) {
    this.cookieValue = this.cookieService.get("Logs_Cookie_data");
    this.doc = doc
  }

  desktopView: boolean = true

  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.desktopView = false;
    } else {
      this.desktopView = true;
    }
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
    productDetail: ['', Validators.required]
  })


  // LOGS ADD PRODUCT METHOD
  addNewProduct() {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    // NEW PRODUCT INPUT DATA
    let newProductJSONData = {
      product: this.excelData,
      token: this.cookieValue,
      key: "ADD_NEW_SPREADSHEET_PRODUCT"
    }
    this.communicatorService.onSubmitService(newProductJSONData).subscribe({
      next: (res) => {
        console.log(res)
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
        console.log(err)
        // HIDE LOADER ANIMATION
        this.spinner.hide();
      }
    })


  }

  private showAlert(
      title: string,
      text: string,
      icon: 'success' | 'error'
    ): void {
      Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
    }


}
