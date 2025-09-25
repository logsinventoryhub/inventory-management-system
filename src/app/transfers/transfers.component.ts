import { CommonModule } from '@angular/common';
import { CommunicatorService, Transfer } from '../communicator.service';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-transfers',
  imports: [CommonModule, FormsModule, RouterModule, NgxSpinnerModule],
  templateUrl: './transfers.component.html',
  styleUrl: './transfers.component.scss',
})
export class TransfersComponent implements OnInit {
  transfers: any[] = [];
  admin: boolean;
  manager: boolean;
  staff: boolean;
  role = '';
  cookieValue: string;
  transfersInterface: Transfer[] = [];
  selectedTransfer: Transfer = {
    id: 0,
    product: '',
    quantity: 0,
    from_address: '',
    to_address: '',
    assigned_to: '',
    status: '',
    code: '',
    date: '',
    key: 'UPDATE_TRANSFER',
    message: '',
    token: '',
  };

  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE WEBPAGE LOADS
  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {}

  /**
   * ON INITIALIZATION METHOD
   */
  ngOnInit(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();

    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
    this.fetchTransfers();
    this.spinner.hide();

    this.communicatorService.data$.subscribe((data) => {
      const member = data.member?.[0] || {};
      this.role = this.getRoleName(member.role_id);
    });
  }

  openEditModal(transfer: Transfer): void {
    this.selectedTransfer = {
      ...transfer,
      key: 'UPDATE_TRANSFER',
      token: this.cookieValue,
    }; // deep copy
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  private fetchTransfers(): void {
    // A JSON DATA KEY TO FETCH TRANSFERS
    let fetchTransfersJSONData = {
      token: this.cookieValue,
      key: 'GET_TRANSFERS',
    };
    // HIDE LOADER ANIMATION
    this.spinner.hide();
    this.communicatorService.onSubmitService(fetchTransfersJSONData).subscribe({
      next: (res) => {
        this.transfers = res.message;
        console.log(this.transfers);
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

  private getRoleName(roleId: number): string {
    const roles: { [key: number]: string } = {
      1: 'Admin',
      2: 'Manager',
      3: 'Staff',
    };
    return roles[roleId] || '';
  }

  saveChanges(): void {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    console.log(this.selectedTransfer);
    this.communicatorService
      .updateTransfer(this.selectedTransfer)
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
          this.fetchTransfers();
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
    let deleteTransferData = {
      supplierID: id,
      token: this.cookieValue,
      key: 'DELETE_TRANSFER',
    };
    this.communicatorService.deleteItem(deleteTransferData).subscribe({
      next: (res) => {
        // HIDE LOADER ANIMATION
        this.spinner.hide();
        if (res.code === '001') {
          this.transfers = this.transfers.filter((item) => item.id !== id);
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
