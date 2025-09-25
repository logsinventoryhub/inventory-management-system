import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CommunicatorService, Location } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
declare var bootstrap: any;

interface State {
  name: string;
}

interface Country {
  name: string;
  disabled?: boolean;
  states: State[];
}

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss',
})
export class WarehouseComponent implements OnInit {
  warehouses: any[] = [];
  cookieValue: string = '';
  currentPage = 1;
  faSearch = faSearch;
  locationsInterface: Location[] = [];
  selectedLocation: Location = {
    id: 0,
    country: '',
    state: '',
    street: '',
    code: '',
    date: '',
    key: 'UPDATE_LOCATION',
    message: '',
    token: '',
  };
  states: any[] = [];
  readonly updateLocationForm: FormGroup;
  countries: Country[] = [];
  filteredStates: State[] = [];

  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private readonly fb: FormBuilder,
    private readonly http: HttpClient
  ) {
    this.updateLocationForm = this.fb.group({
      country: ['', Validators.required],
      state: [{ value: '', disabled: true }, Validators.required],
      street: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
    this.fetchWarehouses();

    this.http.get<Country[]>('/assets/json/countries.json').subscribe({
      next: (data) => {
        this.countries = data;

        // Watch country changes and filter states
        this.updateLocationForm
          .get('country')
          ?.valueChanges.subscribe((selectedCountry) => {
            const country = this.countries.find(
              (c) => c.name === selectedCountry
            );
            this.filteredStates = country ? country.states : [];

            const stateControl = this.updateLocationForm.get('state');

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

  private fetchWarehouses(): void {
    const payload = {
      token: this.cookieValue,
      key: 'GET_ADDRESSES',
    };

    this.spinner.show();

    this.communicatorService.onSubmitService(payload).subscribe({
      next: (res) => {
        this.warehouses = res?.message || [];
        console.log('Fetched warehouses:', this.warehouses);
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error fetching warehouses:', err);
        this.spinner.hide();
      },
    });
  }

  openEditModal(location: Location): void {
    const modalElement = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modalElement);

    // Set selectedLocation for other logic (e.g., ID, token)
    this.selectedLocation = {
      ...location,
      key: 'UPDATE_LOCATION',
      token: this.cookieValue,
    };

    // Patch form values
    this.updateLocationForm.patchValue({
      country: location.country,
      street: location.street,
    });

    // Trigger state dropdown population
    const selectedCountry = this.countries.find(
      (c) => c.name === location.country
    );
    this.filteredStates = selectedCountry ? selectedCountry.states : [];

    const stateControl = this.updateLocationForm.get('state');
    if (this.filteredStates.length > 0) {
      stateControl?.enable();
      stateControl?.setValue(location.state);
    } else {
      stateControl?.reset();
      stateControl?.disable();
    }

    modal.show();
  }

  saveChanges(): void {
    if (this.updateLocationForm.invalid) {
      this.updateLocationForm.markAllAsTouched();
      return;
    }

    const formData = this.updateLocationForm.value;

    // Merge form values into selectedLocation (preserve id, code, token)
    const updatedLocation: Location = {
      ...this.selectedLocation,
      ...formData,
    };

    this.spinner.show();
    this.communicatorService
      .updateLocation(updatedLocation)
      .subscribe((res) => {
        this.spinner.hide();

        if (res.code == '001') {
          Swal.fire({
            title: 'Success!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.fetchWarehouses();

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
      text: 'This action will permanently delete the location and all related products.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // SHOW LOADER ANIMATION
        this.spinner.show();

        let deleteLocationData = {
          id: id,
          token: this.cookieValue,
          key: 'DELETE_LOCATION',
        };

        this.communicatorService.deleteItem(deleteLocationData).subscribe({
          next: (res) => {
            this.spinner.hide();
            if (res.code === '001') {
              this.warehouses = this.warehouses.filter((item) => item.id !== id);
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
