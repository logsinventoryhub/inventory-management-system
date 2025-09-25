import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

interface State {
  name: string;
}

interface Country {
  name: string;
  disabled?: boolean;
  states: State[];
}

@Component({
  selector: 'app-newcustomer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NgxSpinnerModule],
  templateUrl: './newcustomer.component.html',
  styleUrl: './newcustomer.component.scss',
})
export class NewcustomerComponent implements OnInit {
  readonly addCustomerForm: FormGroup;
  countries: Country[] = [];
  filteredStates: State[] = [];
  readonly cookieValue: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly communicatorService: CommunicatorService,
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly spinner: NgxSpinnerService,
    private readonly snackBar: MatSnackBar
  ) {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');

    this.addCustomerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: [''],
      phone: ['', Validators.required],
      country: [''],
      state: [{ value: '', disabled: true }],
      street: [''],
    });
  }

  ngOnInit(): void {
    this.http.get<Country[]>('/assets/json/countries.json').subscribe({
      next: (data: Country[] | null) => {
        if (!data) {
          console.error('Countries list is null');
          return;
        }

        this.countries = data;

        this.addCustomerForm.get('country')?.valueChanges.subscribe((selectedCountry) => {
          const foundCountry = this.countries.find((c) => c.name === selectedCountry);
          this.filteredStates = foundCountry?.states ?? [];

          const stateControl = this.addCustomerForm.get('state');

          if (this.filteredStates.length) {
            stateControl?.enable();
            stateControl?.setValue(this.filteredStates[0].name);
          } else {
            stateControl?.reset();
            stateControl?.disable();
          }
        });
      },
      error: (err) => {
        console.error('Failed to load countries.json', err);
      },
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  addCustomer(): void {
    if (this.addCustomerForm.invalid) {
      this.addCustomerForm.markAllAsTouched();
      return;
    }

    this.spinner.show();

    const payload = {
      ...this.addCustomerForm.getRawValue(),
      token: this.cookieValue,
      key: 'ADD_NEW_CUSTOMER',
    };

    console.log(payload);
    this.communicatorService.onSubmitService(payload).subscribe({
      next: (response) => {
        if (!response) {
          this.spinner.hide();
          this.showAlert('Error!', 'No response received', 'error');
          return;
        }

        const { code, message } = response;

        const isSuccess = code === '001';
        this.showAlert(
          isSuccess ? 'Success!' : 'Error!',
          message || 'No message provided',
          isSuccess ? 'success' : 'error'
        );
        this.spinner.hide();

        if (isSuccess) {
          this.addCustomerForm.reset();
          this.filteredStates = [];
          this.router.navigate(['/dashboard/customers']);
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Add customer failed:', err);
        this.showAlert(
          'Error!',
          'An unexpected error occurred. Please try again.',
          'error'
        );
      },
    });
  }

  private showAlert(title: string, text: string, icon: 'success' | 'error'): void {
    Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
  }
}
