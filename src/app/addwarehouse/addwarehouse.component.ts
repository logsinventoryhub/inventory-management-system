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
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  selector: 'app-addwarehouse',
  templateUrl: './addwarehouse.component.html',
  styleUrl: './addwarehouse.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    // ...same imports
  ],
})
export class AddwarehouseComponent implements OnInit {
  readonly addWarehouseForm: FormGroup;
  countries: Country[] = [];
  filteredStates: State[] = [];
  readonly cookieValue: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly communicatorService: CommunicatorService,
    private readonly cookieService: CookieService,
    private router: Router,
    private readonly spinner: NgxSpinnerService,
    private readonly snackBar: MatSnackBar
  ) {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');

    this.addWarehouseForm = this.fb.group({
      country: ['', Validators.required],
      state: [{ value: '', disabled: true }, Validators.required],
      street: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.http.get<Country[]>('/assets/json/countries.json').subscribe({
      next: (data) => {
        this.countries = data;

        // Watch country changes and filter states
        this.addWarehouseForm
          .get('country')
          ?.valueChanges.subscribe((selectedCountry) => {
            const country = this.countries.find(
              (c) => c.name === selectedCountry
            );
            this.filteredStates = country ? country.states : [];

            const stateControl = this.addWarehouseForm.get('state');

            if (this.filteredStates.length) {
              stateControl?.enable();
              // Auto-select the first state
              stateControl?.setValue(this.filteredStates[0].name);
            } else {
              stateControl?.reset(); // Clear any previous value
              stateControl?.disable();
            }
          });
      },
      error: (err) => {
        console.error('Failed to load countries', err);
      },
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  addWarehouse(): void {
    if (this.addWarehouseForm.invalid) {
      this.addWarehouseForm.markAllAsTouched();
      return;
    }

    this.spinner.show();

    const payload = {
      ...this.addWarehouseForm.getRawValue(), // includes disabled fields if needed
      token: this.cookieValue,
      key: 'ADD_NEW_ADDRESS',
    };

    this.communicatorService.onSubmitService(payload).subscribe({
      next: ({ code, message }) => {
        const isSuccess = code === '001';
        this.showAlert(
          isSuccess ? 'Success!' : 'Error!',
          message,
          isSuccess ? 'success' : 'error'
        );
        this.spinner.hide();

        if (isSuccess) {
          this.addWarehouseForm.reset();
          this.filteredStates = [];
          this.router.navigate(["/dashboard/store"]);
        }
      },
      error: (err) => {
        console.error('Add warehouse failed:', err);
        this.spinner.hide();
        this.showAlert(
          'Error!',
          'An unexpected error occurred. Please try again.',
          'error'
        );
      },
    });
  }

  private showAlert(
    title: string,
    text: string,
    icon: 'success' | 'error'
  ): void {
    Swal.fire({ title, text, icon, confirmButtonText: 'OK', timer: 10000, timerProgressBar: true });
  }
}
