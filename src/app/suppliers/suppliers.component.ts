import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommunicatorService, Supplier } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-suppliers',
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    NgxSpinnerModule,
    FontAwesomeModule,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent implements AfterViewInit {
  suppliersInterface: Supplier[] = [];
  selectedSupplier: Supplier = {
    id: 0,
    name: '',
    email: '',
    category: '',
    phone: '',
    website: '',
    status: '',
    code: '',
    date: '',
    key: 'UPDATE_SUPPLIER',
    message: '',
    token: '',
  };
  cookieValue: string;

  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE WEBPAGE LOADS
  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {}
  suppliers: any[] = [];
  faSearch = faSearch;
  mobileView: boolean = true;
  filters = ['All', 'Date', 'Colour', 'Type', 'Brand', 'Weight', 'Location'];

  ngAfterViewInit() {
    // SHOW LOADER ANIMATION
    this.spinner.show();

    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
    this.loadSuppliers();
  }

  openEditModal(supplier: Supplier): void {
    this.selectedSupplier = {
      ...supplier,
      key: 'UPDATE_SUPPLIER',
      token: this.cookieValue,
    }; // deep copy
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  loadSuppliers(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();

    // A JSON DATA KEY TO FETCH SUPPLIERS
    let fetchSupplierData = {
      token: this.cookieValue,
      key: 'GET_SUPPLIERS',
    };
    this.communicatorService.onSubmitService(fetchSupplierData).subscribe({
      next: (res) => {
        this.suppliers = res.message;
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

  saveChanges(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    console.log(this.selectedSupplier);
    this.communicatorService
      .updateSupplier(this.selectedSupplier)
      .subscribe((res) => {
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        if (res.code == '001') {
          Swal.fire({
            title: 'Success!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.loadSuppliers();
          const modalElement = document.getElementById('editModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        } else {
          Swal.fire({
            title: 'Error!',
            text: res.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
  }

  deleteItem(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the supplier and all related products.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // SHOW LOADER ANIMATION
        this.spinner.show();

        let deleteSupplierData = {
          id: id,
          token: this.cookieValue,
          key: 'DELETE_SUPPLIER',
        };

        this.communicatorService.deleteItem(deleteSupplierData).subscribe({
          next: (res) => {
            this.spinner.hide();
            if (res.code === '001') {
              this.suppliers = this.suppliers.filter(
                (item) => item.id !== id
              );
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: res.message || 'Successful.',
                timer: 5000, // 5 seconds
                timerProgressBar: true,
                showConfirmButton: true,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res.message || 'Something went wrong.',
                timer: 5000, // 5 seconds
                timerProgressBar: true,
                showConfirmButton: true,
              });
            }
          },
          error: (err) => {
            this.spinner.hide();
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: err.message || 'Something went wrong.',
              timer: 5000, // 5 seconds
              timerProgressBar: true,
              showConfirmButton: true,
            });
          },
        });
      }
    });
  }
}
