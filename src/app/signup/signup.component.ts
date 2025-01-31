import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, Validators, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule, 
    RouterModule, 
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    //BrowserAnimationsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  
  signUp(signUpInfo: any) {
    if(signUpInfo.value.password === signUpInfo.value.confirmpassword) {
      let signup_data = {
        firstname: signUpInfo.value.firstname,
        lastname: signUpInfo.value.lastname,
        businessname: signUpInfo.value.businessname,
        email: signUpInfo.value.email,
        phonenumber: signUpInfo.value.phonenumber,
        country: signUpInfo.value.country,
        state: signUpInfo.value.state,
        address: signUpInfo.value.address,
        companylogo: signUpInfo.value.companylogo,
        password: signUpInfo.value.password
      }
      console.log(signup_data)
    }else {
      alert("Recheck Password!")
    }
  }

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: [''],
  });
  isEditable = false;

}
