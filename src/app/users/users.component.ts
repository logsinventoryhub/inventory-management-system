import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommunicatorService, User } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    NgxSpinnerModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  cookieValue: string = '';
  currentPage = 1;
  searchText: string = '';
  users: any[] = [];
  usersInterface: User[] = [];
  selectedUser: User = {
    id: 0,
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    code: '',
    date: '',
    key: 'UPDATE_USER',
    message: '',
    token: '',
  };

  constructor(
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private communicatorService: CommunicatorService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
    this.fetchUsers();
  }

  private fetchUsers(): void {
    if (this.cookieValue) {
      const API_JSON_DATA = {
        token: this.cookieValue,
        key: 'GET_USERS_DATA',
      };
      this.communicatorService.onSubmitService(API_JSON_DATA).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.users = res.users;
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error fetching users data:', err);
        },
      });
    }
  }

  get filteredUsers() {
    const term = this.searchText.toLowerCase();
    return this.users.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  }

  openEditModal(user: User): void {
    this.selectedUser = {
      ...user,
      key: 'updateSupplier',
      token: this.cookieValue,
    }; // deep copy
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  saveChanges(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    console.log(this.selectedUser);
    this.communicatorService
      .updateUser(this.selectedUser)
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
          this.fetchUsers();
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
    // SHOW LOADER ANIMATION
    this.spinner.show();
    // A JSON DATA KEY TO FETCH CATEGORIES
    let deleteUserData = {
      supplierID: id,
      token: this.cookieValue,
      key: 'DELETE_USER',
    };
    this.communicatorService.deleteItem(deleteUserData).subscribe({
      next: (res) => {
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        if (res.code === '001') {
          this.users = this.users.filter((item) => item.id !== id);
          Swal.fire({
            title: 'Success!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: res.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
      error: (err) => {
        console.log(err);
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
