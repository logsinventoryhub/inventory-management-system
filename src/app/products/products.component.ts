import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements AfterViewInit {
  displayedColumns: string[] = ['product', 'productid', 'price', 'category', 'stock', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
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

const ELEMENT_DATA: PeriodicElement[] = [
  
];
