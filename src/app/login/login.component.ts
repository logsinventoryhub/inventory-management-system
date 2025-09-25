import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  NgForm,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MatTabsModule } from '@angular/material/tabs';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    RouterModule,
    FontAwesomeModule,
    NgxSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [CookieService],
})
export class LoginComponent {
  // FontAwesome Icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  // UI State
  hide = signal(true);

  // FormBuilder
  private _formBuilder = inject(FormBuilder);

  // Form Group for login validation
  loginFormGroup = this._formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  // Inject services
  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  // Toggle password visibility
  togglePassword(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // Submit login form
  login(form: NgForm): void {
    if (form.invalid) return;

    this.spinner.show();

    const loginJSONData = {
      email: form.value.email,
      password: form.value.password,
      key: 'login',
    };

    console.log('Submitting login:', loginJSONData);

    this.communicatorService.onSubmitService(loginJSONData).subscribe({
      next: (res) => {
        this.spinner.hide();

        if (res.code === '001') {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: res.message || 'Successful.',
            timer: 5000, // 5 seconds
            timerProgressBar: true,
            showConfirmButton: true,
          });
          this.cookieService.set('Logs_Cookie_data', res.token, 1, '/');
          this.router.navigate(['/dashboard']);
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
        console.error('Login error:', err);
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
}
