import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule, FormControl, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {
  cookieValue: string;
  private _formBuilder = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);

  // NOTIFICATION SNACKBAR METHOD
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  // FRONT END VALIDATION FOR CATEGORY INPUTS
  CreateCategoryFormGroup = this._formBuilder.group({
    categoryName: ['', Validators.required],
    categoryStatus: ['', Validators.required]
  })

  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE WEBPAGE LOADS
  constructor(private communicatorService: CommunicatorService, private cookieService: CookieService, private router: Router, private spinner: NgxSpinnerService) {
    this.cookieValue = this.cookieService.get("Logs_Cookie_data");
  }

  // ON INITIALIZATION METHOD
  ngOnInit() {

  }

  // CREATE CATEGORY METHOD THAT SENDS CATEGORY DATA TO THE BACKEND FOR PROCESSING INTO THE DATABASE
  createCategory(form: NgForm): void {
    if (form.invalid) {
      this.showAlert('Error!', 'Please fill out all required fields.', 'error');
      return;
    }

    const { name, status } = form.value;

    const requestPayload = {
      name,
      status,
      token: this.cookieValue,
      key: 'CREATE_CATEGORY'
    };

    this.spinner.show();

    this.communicatorService.onSubmitService(requestPayload).subscribe({
      next: (res) => {
        this.spinner.hide();
        const alertType = res.code === '001' ? 'success' : 'error';
        this.showAlert(alertType === 'success' ? 'Success!' : 'Error!', res.message, alertType);
        if(res.code === '001') {
          this.router.navigate(["/dashboard/categories"]);
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
        this.showAlert('Error!', 'An unexpected error occurred. Please try again.', 'error');
      }
    });
  }

  private showAlert(title: string, text: string, icon: 'success' | 'error'): void {
    Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
  }


}
