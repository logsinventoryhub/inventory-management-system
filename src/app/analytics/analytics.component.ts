import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements AfterViewInit {
  displayedColumns: string[] = ['product', 'price', 'order', 'stock'];
  //recentOrdersColumns: string[] = ['product', 'Order ID', 'Customer Name', 'Quantity', 'Amount', 'Payment', 'Status', 'Action'];
  dataSource = new MatTableDataSource<TopSellingProductsElement>(TOP_SELLING_PRODUCTS_ELEMENT_DATA);
  //recentOrdersDataSource = new MatTableDataSource<RecentOrdersElement>(RECENT_ORDERS_ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}

export interface TopSellingProductsElement {
  product: string;
  price: number;
  order: number;
  stock: number;
}

/*export interface RecentOrdersElement {
  product: string;
  orderID: number;
  customerName: string;
  quantity: number;
  amount: number;
  payment: string;
  status: string;
  action: string
}*/

const TOP_SELLING_PRODUCTS_ELEMENT_DATA: TopSellingProductsElement[] = [
  //{product: 'Cement', price: 5000, order: 10, stock: 15},
];

/*const RECENT_ORDERS_ELEMENT_DATA: RecentOrdersElement[] = [
  //{product: 'Cement', price: 5000, order: 10, stock: 15},
];*/
