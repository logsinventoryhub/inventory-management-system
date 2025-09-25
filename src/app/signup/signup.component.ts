import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommunicatorService } from '../communicator.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FontAwesomeModule,
    MatGridListModule,
    MatSelectModule,
    CommonModule,
    NgxSpinnerModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'], // Fixed property name
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {
  countries: any[] = [];
  states: any[] = [];
  disableButton = false;
  private _snackBar = inject(MatSnackBar);
  selectedCountry = '';
  selectedState = '';

  // FontAwesome icons
  faEnvelope = faEnvelope;
  faPhone = faPhone;

  hide = signal(true);

  constructor(
    private communicatorService: CommunicatorService,
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.http.get<any[]>('/assets/json/countries.json').subscribe(data => {
      this.countries = data;
      console.log('Countries loaded:', data);
    });
  }

  onCountryChange(countryName: string) {
    this.selectedCountry = countryName;

    const country = this.countries.find(c => c.name === countryName);
    this.states = country ? country.states : [];
    this.selectedState = ''; // reset state when country changes
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }

  onSignUp(signUpData: NgForm) {
    if (signUpData.invalid) {
      this.openSnackBar('Please fill out all required fields.', 'Close');
      return;
    }

    if (signUpData.value.password !== signUpData.value.confirmPassword) {
      this.openSnackBar('Password mismatch!', 'Close');
      return;
    }

    this.disableButton = true;
    this.spinner.show();

    const signUpJSONData = {
      businessName: signUpData.value.businessName,
      businessEmail: signUpData.value.businessEmail,
      businessCountry: this.selectedCountry,
      businessState: this.selectedState,
      businessAddress: signUpData.value.businessAddress,
      firstName: signUpData.value.firstName,
      lastName: signUpData.value.lastName,
      phoneNumber: signUpData.value.mobileNumber, // matched with input name mobileNumber
      password: signUpData.value.password,
      key: 'signUp'
    };

    this.communicatorService.onSubmitService(signUpJSONData).subscribe({
          next: (res) => {
            this.disableButton = false;
            console.log(res)
            if (res.code == "001") {
              Swal.fire({
                title: 'Success!',
                text: res.message,
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.router.navigate(["/"]);
    
              // HIDE LOADER ANIMATION
              this.spinner.hide();
    
            } else {
              Swal.fire({
                title: 'Error!',
                text: res.message,
                icon: 'error',
                confirmButtonText: 'OK'
              });
    
              // HIDE LOADER ANIMATION
              this.spinner.hide();
            }
          },
          error: (err) => {
            this.disableButton = false;
            console.log(err)
            // HIDE LOADER ANIMATION
            this.spinner.hide();
          }
        })
  }
}
