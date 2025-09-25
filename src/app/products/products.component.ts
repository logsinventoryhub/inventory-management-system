import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommunicatorService, Product } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
declare var bootstrap: any;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    CommonModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    FormsModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  productInterface: Product[] = [];
  products: any[] = [];
  categories: any[] = [];
  suppliers: any[] = [];
  locations: any[] = [];
  excelData: any[] = [];

  selectedProduct: Product = {
    id: 0,
    name: '',
    cost_price: 0,
    price: 0,
    discount_price: 0,
    stock_alert: 0,
    category: '',
    description: '',
    image: '',
    vat: false,
    code: '',
    date: '',
    key: 'UPDATE_PRODUCT',
    message: '',
    token: '',
  };

  selectedImageFile: File | null = null;
  previewImage: string | null = null;
  cookieValue: string = '';
  faSearch = faSearch;
  mobileView = true;

  displayedColumns: string[] = [
    'product',
    'productid',
    'price',
    'category',
    'stock',
    'action',
  ];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.spinner.show();
    this.dataSource.paginator = this.paginator;
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
    this.loadProducts();
    this.loadCategories();
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

  loadCategories(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    // A JSON DATA KEY TO FETCH CATEGORIES
    let API_JSON_DATA = {
      token: this.cookieValue,
      key: 'GET_CATEGORIES',
    };
    this.communicatorService.onSubmitService(API_JSON_DATA).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.code === '001') {
          this.categories = res.message; // array of categories
        } else {
          this.categories = []; // empty array to avoid *ngFor errors
          console.warn('No categories found.');
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error fetching categories:', err);
        this.categories = [];
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log('Excel data:', this.excelData);
    };
    reader.readAsArrayBuffer(file);
  }

  addNewProduct() {
    this.spinner.show();
    const newProductJSONData = {
      product: this.excelData,
      token: this.cookieValue,
      key: 'ADD_NEW_SPREADSHEET_PRODUCT',
    };
    this.communicatorService.onSubmitService(newProductJSONData).subscribe({
      next: (res) => {
        const alertType = res.code === '001' ? 'success' : 'error';
        this.showAlert(
          alertType === 'success' ? 'Success!' : 'Error!',
          res.message,
          alertType
        );
        this.spinner.hide();
        if (res.code === '001') {
          this.loadProducts();
        }
      },
      error: (err) => {
        console.error(err);
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

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  openEditModal(product: Product): void {
    this.selectedProduct = {
      ...product,
      key: 'UPDATE_PRODUCT',
      token: this.cookieValue,
    };
    this.previewImage = null;
    this.selectedImageFile = null;
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  saveChanges(): void {
    const formData = new FormData();
    formData.append('id', String(this.selectedProduct.id));
    formData.append('name', this.selectedProduct.name || '');
    formData.append('category', this.selectedProduct.category || '');
    formData.append('cost_price', String(this.selectedProduct.cost_price || 0));
    formData.append('price', String(this.selectedProduct.price || 0));
    formData.append(
      'discount_price',
      String(this.selectedProduct.discount_price || 0)
    );
    formData.append(
      'stock_alert',
      String(this.selectedProduct.stock_alert || 0)
    );
    formData.append('description', this.selectedProduct.description || '');
    formData.append('vat', this.selectedProduct.vat ? '1' : '0');
    formData.append('token', this.cookieValue);
    formData.append('key', 'UPDATE_PRODUCT');

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.spinner.show();

    this.communicatorService.updateProduct(formData).subscribe({
      next: (res) => {
        this.spinner.hide();

        if (res && res.code === '001') {
          this.showAlert('Success!', res.message, 'success');
          this.loadProducts();
          const modalElement = document.getElementById('editModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        } else {
          this.showAlert('Error!', res?.message || 'Unexpected error', 'error');
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Update failed:', err);
        this.showAlert(
          'Error!',
          'Could not update product. Please try again.',
          'error'
        );
      },
    });
  }

  deleteItem(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be deleted permanently.',
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
          key: 'DELETE_PRODUCT',
        };
        this.communicatorService.deleteItem(deleteProductData).subscribe({
          next: (res) => {
            this.spinner.hide();
            if (res.code === '001') {
              this.products = this.products.filter((item) => item.id !== id);
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
}

export interface PeriodicElement {
  product: string;
  productid: string;
  price: number;
  category: string;
  stock: number;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
