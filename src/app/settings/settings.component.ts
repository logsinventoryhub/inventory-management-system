import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { CommunicatorService } from '../communicator.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  username = '';
  first_name = '';
  last_name = '';
  phone!: number;
  email = '';
  role = '';
  business = '';
  country = '';
  state = '';
  disable_button = false;
  private token = '';

  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {
    this.token = this.cookieService.get('Logs_Cookie_data');
  }

  ngOnInit(): void {
    this.communicatorService.data$.subscribe(data => {
      const user = data.user?.[0] || {};
      const profile = data.profile?.[0] || {};
      const member = data.member?.[0] || {};
      const business = data.business?.[0] || {};

      this.username = user.username || '';
      this.email = user.email || '';
      this.first_name = profile.first_name || '';
      this.last_name = profile.last_name || '';
      this.phone = profile.phone || 0;;
      this.role = this.getRoleName(member.role_id);
      this.business = business.name || '';
    });
  }

  onResetPassword(form: NgForm): void {
    if (form.invalid) {
      this.showAlert('Error!', 'Please fill out all required fields.', 'error');
      return;
    }

    const { current_password, password, confirm_password } = form.value;

    if (password !== confirm_password) {
      this.showAlert('Error!', 'New password and confirm password mismatch', 'error');
      return;
    }

    this.disable_button = true;
    this.spinner.show();

    const payload = {
      current_password,
      password,
      confirm_password,
      token: this.token,
      key: 'RESET_ACCOUNT_PASSWORD'
    };

    this.communicatorService.onUpdateService(payload).subscribe({
      next: (res) => {
        this.disable_button = false;
        this.spinner.hide();

        if (res.code === '001') {
          this.showAlert('Success!', res.message, 'success');
        } else {
          this.showAlert('Error!', res.message, 'error');
        }
      },
      error: (err) => {
        console.error(err);
        this.disable_button = false;
        this.spinner.hide();
        this.showAlert('Error!', 'An error occurred while resetting the password.', 'error');
      }
    });
  }

  private getRoleName(roleId: number): string {
    const roles: { [key: number]: string } = {
      1: 'Admin',
      2: 'Manager',
      3: 'Staff'
    };
    return roles[roleId] || '';
  }

  private showAlert(title: string, text: string, icon: 'success' | 'error') {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK'
    });
  }
}
