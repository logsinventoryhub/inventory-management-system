import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { CommunicatorService } from '../communicator.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-newpurchase',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    RouterModule,
  ],
  templateUrl: './newpurchase.component.html',
  styleUrl: './newpurchase.component.scss',
})
export class NewpurchaseComponent implements OnInit {
  selectedProductId: number | undefined;
  orderType?: string;
  unit_cost = 0;
  order_quantity = 0;
  unit_price: number = 0;
  quantity_sold = 0;
  total_cost = 0;
  total_price = 0;
  private cookieValue: string;

  customers: any[] = [];
  products: any[] = [];
  suppliers: any[] = [];
  locations: any[] = [];

  // Receipt details
  business = '';
  business_address = '';
  business_phone = '';
  order_id = '';
  name = '';
  street = '';
  address = '';
  phone = '';
  payment_status = '';
  date = '';
  supplier = '';
  supplier_email = '';
  supplier_phone = '';
  delivery_status = '';
  quantity = 0;
  amount = 0;
  total = 0;
  product = '';

  private snackBar = inject(MatSnackBar);

  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
  }

  ngOnInit(): void {
    this.fetchProducts();
    //this.fetchCustomers();
    this.fetchSuppliers();
    this.fetchLocations();
  }

  onProductChange(productId: number) {
    const selectedProduct = this.products.find((p) => p.id === productId);
    if (selectedProduct) {
      this.unit_price = selectedProduct.price;
    }
  }

  /*private fetchCustomers(): void {
    const payload = { token: this.cookieValue, key: 'GET_CUSTOMERS' };
    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.customers = res.code === '001' ? res.message : [];
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }*/

  private fetchProducts(): void {
    this.spinner.show();
    const payload = { token: this.cookieValue, key: 'GET_PRODUCTS' };
    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        const seenNames = new Set<string>();
        const uniqueProducts = res.message.filter((product: any) => {
          if (seenNames.has(product.name)) {
            return false;
          }
          seenNames.add(product.name);
          return true;
        });

        this.products = uniqueProducts;
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  private fetchSuppliers(): void {
    const payload = { token: this.cookieValue, key: 'GET_SUPPLIERS' };
    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.suppliers = res.message;
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

   private fetchLocations(): void {
    const payload = {
      token: this.cookieValue,
      key: 'GET_ADDRESSES',
    };

    this.spinner.show();

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.locations = res?.message || [];
        console.log('Fetched warehouses:', this.locations);
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error fetching warehouses:', err);
        this.spinner.hide();
      },
    });
  }

  calculatePurchaseTotalCost() {
    this.total_cost = this.unit_cost * this.order_quantity;
  }

  /*calculateSaleTotalPrice() {
    this.total_price = this.unit_price * this.quantity_sold;
  }*/

  /*printReceipt() {
    const printContent = document.getElementById('printSection')?.innerHTML;
    const printWindow = window.open('', '_blank', 'width=900,height=650');

    if (printWindow && printContent) {
      printWindow.document.open();
      printWindow.document.write(`
          <html>
            <head>
              <title>Order Receipt</title>
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
              <style>
                body { padding: 20px; font-family: Arial, sans-serif; }
                .table th { background-color: #e9ecef; }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              ${printContent}
            </body>
          </html>`);
      printWindow.document.close();
    } else {
      this.openSnackBar('Unable to print receipt. Please try again.', 'Close');
    }
  }*/

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  addNewOrder(form: NgForm) {
    const data = form.value;

    const payload = {
      ...data,
      total_cost: this.total_cost,
      token: this.cookieValue,
      key: 'ADD_NEW_PURCHASE_ORDER',
    };

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.code === '001') {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: res.message || 'Successful.',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: true,
          });
          this.router.navigate(['/dashboard/purchases']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: res.message || 'Something went wrong.',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: true,
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      },
    });
  }

  /*private setReceiptData(data: any) {
    this.business = data.business;
    this.business_address = `${data.business_street}, ${data.business_state}`;
    this.name = `${data.last_name} ${data.first_name}`;
    this.order_id = data.order_id;
    this.amount = data.unit_price;
    this.quantity = data.quantity_sold;
    this.total = data.total_price;
    this.date = data.created_at;
    this.address = `${data.customer_state}, ${data.customer_country}`;
    this.street = data.customer_street;
    this.phone = data.customer_phone;
    this.product = data.product;
  }

  private async showReceiptModal() {
    if (isPlatformBrowser(this.platformId)) {
      const { Modal } = await import('bootstrap');
      const modalElement = document.getElementById('receiptModal');
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    }
  }*/
}
