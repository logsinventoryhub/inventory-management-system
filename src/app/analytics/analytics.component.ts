import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxSpinnerModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit {
  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {}

  cookieValue: string = '';
  inventoryValue: string = '0';
  inventoryProfit: string = '0';
  productsCount: number = 0;
  ordersCount: number = 0;
  admin: boolean = false;
  manager: boolean = false;
  staff: boolean = false;
  products: any[] = [];
  orders: any[] = [];
  recent_products: any[] = [];
  recentOrders: any[] = [];

  numberWithCommas(x: any): string {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  ngOnInit() {
    this.spinner.show();
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');

    this.loadInventoryValue();
    this.loadInventoryProfit();
    this.loadProducts();
    this.loadOrders();
    this.loadOrdersCount();
    this.listenToRole();
  }

  private loadProducts() {
    const payload = {
      token: this.cookieValue,
      key: 'GET_PRODUCTS',
    };

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.products = Array.isArray(res.message) ? res.message : [];

        // Count unique product names
        const uniqueNames = new Set(this.products.map((p) => p.name));
        this.productsCount = uniqueNames.size;

        // Products added within the last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        this.recent_products = this.products.filter((product) => {
          const createdAt = new Date(product.created_at);
          return createdAt > oneDayAgo;
        });

        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.spinner.hide();
      },
    });
  }

  private loadOrders() {
    const payload = {
      token: this.cookieValue,
      key: 'GET_SALES_ORDERS',
    };

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.orders = Array.isArray(res.message) ? res.message : [];
        //this.ordersCount = this.orders.length;

        // Orders added within the last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        this.recentOrders = this.orders.filter((order) => {
          const createdAt = new Date(order.created_at);
          return createdAt > oneDayAgo;
        });

        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.spinner.hide();
      },
    });
  }

  private loadInventoryValue() {
    const payload = {
      token: this.cookieValue,
      key: 'GET_INVENTORY_VALUE',
    };

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.inventoryValue = this.numberWithCommas(res.message);
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error loading inventory value:', err);
        this.spinner.hide();
      },
    });
  }

  private loadInventoryProfit() {
    const payload = {
      token: this.cookieValue,
      key: 'GET_INVENTORY_PROFIT',
    };

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.inventoryProfit = this.numberWithCommas(res.message);
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error loading inventory profit:', err);
        this.spinner.hide();
      },
    });
  }

  private loadOrdersCount() {
    const payload = {
      token: this.cookieValue,
      key: 'GET_ORDERS_COUNT',
    };

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.ordersCount = res.message;
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error loading orders count:', err);
        this.spinner.hide();
      },
    });
  }

  private listenToRole() {
    this.communicatorService.data$.subscribe((data) => {
      const roleId = data.member?.[0]?.role_id;

      this.admin = roleId === 1;
      this.manager = roleId === 2;
      this.staff = roleId === 3;

      console.log('User role:', roleId);
    });
  }

  getTimeAgo(dateString: string): string {
  const now = new Date();
  const createdDate = new Date(dateString);
  const diffInMs = now.getTime() - createdDate.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  if (diffInMinutes < 1) {
    return 'just now';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
}

}
