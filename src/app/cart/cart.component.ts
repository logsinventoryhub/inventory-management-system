import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CommunicatorService } from '../communicator.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  displayedColumns: string[] = [
    'product',
    'price',
    'quantity',
    'total',
    'remove',
  ];
  cartItems: any[] = [];
  checkoutForm = {
    first_name: '',
    last_name: '',
    phone: '',
  };
  business: any;
  businessId: any;

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private communicatorService: CommunicatorService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('business');
    this.business = name;
    this.businessId = id;
    this.cartService.getCart().subscribe((items) => {
      this.cartItems = items;
    });
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.cartItems = this.cartItems.filter((item) => item.id !== productId);
    });
  }

  clearCart() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will remove all items from your cart!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear cart!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart().subscribe(() => {
          this.cartItems = [];
          Swal.fire({
            title: 'Success!',
            text: 'Cart cleared!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        });
      }
    });
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  increment(item: any) {
    item.quantity++;
  }

  decrement(item: any) {
    if (item.quantity > 1) item.quantity--;
  }

  submitOrder(form: NgForm) {
    if (form.invalid || this.cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in all customer fields and ensure your cart has items.',
      });
      return;
    }

    const customerData = form.value;
    const cartData = this.cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const payload = {
      key: 'ADD_NEW_CUSTOMER_ORDER',
      customer: {
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        phone: customerData.phone,
      },
      cart: cartData,
      token: this.businessId
    };

    this.spinner.show();

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.code === '001') {
          Swal.fire({
            icon: 'success',
            title: 'Order Placed!',
            text: res.message || 'Your order has been submitted successfully.',
            timer: 5000,
            showConfirmButton: false,
          });

          // Clear form and cart
          form.resetForm();
          this.cartService.clearCart().subscribe(() => {
            this.cartItems = [];
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: res.message || 'Could not complete order.',
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: 'Network Error!',
          text: 'Unable to submit your order. Please try again later.',
        });
      },
    });
  }
}

export interface PeriodicElement {
  product: string;
  price: number;
  quantity: number;
  total: number;
  remove: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
