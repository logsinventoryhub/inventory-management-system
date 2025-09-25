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
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { CommunicatorService } from '../communicator.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-neworder',
  standalone: true,
  templateUrl: './neworder.component.html',
  styleUrl: './neworder.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    RouterModule,
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NeworderComponent implements OnInit {
  selectedProductId: number | undefined;
  orderType?: string;
  unit_cost = 0;
  order_quantity = 0;
  unit_price: number = 0;
  discount_price: number = 0;
  quantity_sold = 0;
  total_cost = 0;
  total_price = 0;
  private cookieValue: string;

  customers: any[] = [];
  products: any[] = [];
  suppliers: any[] = [];

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
  }

  ngOnInit(): void {
    this.spinner.show();
    this.fetchCustomers();
    this.fetchProducts();
    this.fetchSuppliers();
    this.spinner.hide();
  }

  onProductChange(productId: number) {
    const selectedProduct = this.products.find((p) => p.id === productId);
    const discount = Number(selectedProduct.discount_price);
    const original = Number(selectedProduct.price);
    if (selectedProduct) {
      this.unit_price = discount && discount !== 0 ? discount : original;
    }
  }

  private fetchCustomers(): void {
    this.spinner.show();
    const payload = { token: this.cookieValue, key: 'GET_CUSTOMERS' };
    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.customers = res.code === '001' ? res.message : [];
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

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
    this.spinner.show();
    const payload = { token: this.cookieValue, key: 'GET_SUPPLIERS' };
    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.suppliers = res.message;
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  calculatePurchaseTotalCost() {
    this.total_cost = this.unit_cost * this.order_quantity;
  }

  calculateSaleTotalPrice(): void {
    const priceToUse =
      this.discount_price > 0 ? this.discount_price : this.unit_price;
    this.total_price = priceToUse * this.quantity_sold;
  }

  printReceipt() {
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
  }

  printAsPDF(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('html2pdf.js').then((module) => {
        const html2pdf = module.default; // ✅ Access default export

        const element = document.getElementById('printSection');
        if (element && html2pdf) {
          const opt = {
            margin: 0.5,
            filename: 'receipt.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
          };

          html2pdf().set(opt).from(element).save();
        }
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  addNewOrder(form: NgForm) {
    const data = form.value;

    const payload = {
      ...data,
      total_price: this.total_price,
      token: this.cookieValue,
      key: 'ADD_NEW_SALE_ORDER',
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

          if (res.type === 'sales') {
            this.setReceiptData(res.data[0]);
            this.cdr.detectChanges();
            this.showReceiptModal();
          }
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

  private setReceiptData(data: any) {
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
    this.phone = data.phone;
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
  }
}
``;
