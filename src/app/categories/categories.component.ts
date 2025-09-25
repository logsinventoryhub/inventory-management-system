import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Category, CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    RouterModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements AfterViewInit {
  categoriesInterface: Category[] = [];
  currentPage = 1;
  selectedCategory: Category = {
    id: 0,
    name: '',
    code: '',
    status: '',
    date: '',
    key: 'UPDATE_CATEGORY',
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
  categories: any[] = [];
  faSearch = faSearch;
  mobileView: boolean = true;

  ngAfterViewInit() {
    // SHOW LOADER ANIMATION
    this.spinner.show();

    this.cookieValue = this.cookieService.get('Logs_Cookie_data');

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

  openEditModal(category: Category): void {
    this.selectedCategory = {
      ...category,
      key: 'UPDATE_CATEGORY',
      token: this.cookieValue,
    }; // deep copy
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
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

  saveChanges(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    console.log(this.selectedCategory);
    this.communicatorService
      .updateCategory(this.selectedCategory)
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
          this.loadCategories();
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
      text: 'This action will permanently delete the category and all related products.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // SHOW LOADER ANIMATION
        this.spinner.show();

        let deleteCategoryData = {
          id: id,
          token: this.cookieValue,
          key: 'DELETE_CATEGORY',
        };

        this.communicatorService.deleteItem(deleteCategoryData).subscribe({
          next: (res) => {
            this.spinner.hide();
            if (res.code === '001') {
              this.categories = this.categories.filter(
                (item) => item.id !== id
              );
              Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: res.message || 'Successful.',
              timer: 10000, // 10 seconds
              timerProgressBar: true,
              showConfirmButton: true,
            });
            } else {
              Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: res.message || 'Something went wrong.',
              timer: 10000, // 10 seconds
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
              timer: 10000, // 10 seconds
              timerProgressBar: true,
              showConfirmButton: true,
            });
          },
        });
      }
    });
  }
}
