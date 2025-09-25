import { ChangeDetectionStrategy, Component, signal, inject, model } from '@angular/core';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule, FormControl, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newuser',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    CommonModule,
    NgxSpinnerModule
  ],
  templateUrl: './newuser.component.html',
  styleUrl: './newuser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewuserComponent {
  cookieValue: string;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  private _snackBar = inject(MatSnackBar);

  // NOTIFICATION SNACKBAR METHOD
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  readonly allow = model(false);
  readonly deny = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  private _formBuilder = inject(FormBuilder);

  createNewUserFormGroup = this._formBuilder.group({
    userName: ['', Validators.required],
    userPosition: ['', Validators.required],
    //userEmail: ['', Validators.required, Validators.email],
    userPhoneNumber: ['', Validators.required],
    password: ['', Validators.required],
    confirmUserPassword: ['', Validators.required],
    addProduct: ['', Validators.required],
    editProduct: ['', Validators.required],
    deleteProduct: ['', Validators.required],
    manageOrders: ['', Validators.required],
    manageStocks: ['', Validators.required],
    manageUsers: ['', Validators.required]

  });

  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE WEBPAGE LOADS
  constructor(private communicatorService: CommunicatorService, private cookieService: CookieService, private router: Router, private spinner: NgxSpinnerService) {
    this.cookieValue = this.cookieService.get("Logs_Cookie_data");
  }


  // LOGS CREATE NEW USER METHOD
  createNewUser(newUserData: NgForm) {
    // SHOW LOADER ANIMATION
    this.spinner.show();
    // FRONT END VALIDATION FOR NEW USER INPUTS
    if (newUserData.value.password === newUserData.value.confirm_password) {
      // NEW USER DETAILS
      let newUserJSONData = {
        first_name: newUserData.value.first_name,
        last_name: newUserData.value.last_name,
        username: newUserData.value.username,
        role: newUserData.value.role,
        email: newUserData.value.email,
        phone: newUserData.value.phone,
        password: newUserData.value.password,
        /*addProduct: newUserData.value.addProduct,
        editProduct: newUserData.value.editProduct,
        deleteProduct: newUserData.value.deleteProduct,
        manageOrders: newUserData.value.manageOrders,
        manageStocks: newUserData.value.manageStocks,
        manageUsers: newUserData.value.manageUsers,*/
        token: this.cookieValue,
        key: "createNewUser"
      }

      // CONNECT TO THE SERVER AND ADD NEW USER DETAILS TO THE DATABASE
      this.communicatorService.onSubmitService(newUserJSONData).subscribe({
        next: (res) => {
          console.log(res)
          if (res.code == "001") {
            // HIDE LOADER ANIMATION
            this.spinner.hide();
            Swal.fire({
              title: 'Success!',
              text: res.message,
              icon: 'success',
              confirmButtonText: 'OK'
            });

            this.router.navigate(["/dashboard/users"]);

          } else {
            // HIDE LOADER ANIMATION
            this.spinner.hide();
            Swal.fire({
              title: 'Error!',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }

        },
        error: (err) => {
          console.log(err)
          // HIDE LOADER ANIMATION
          this.spinner.hide();
        }
      })

    } else {
      // HIDE LOADER ANIMATION
      this.spinner.hide();
      Swal.fire({
        title: 'Error!',
        text: 'Password Mismatch! Please recheck Password.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }

  }

}
