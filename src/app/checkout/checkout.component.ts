import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CustomersignupdialogComponent} from '../customersignupdialog/customersignupdialog.component'
import {CustomerlogindialogComponent} from '../customerlogindialog/customerlogindialog.component'

@Component({
    selector: 'app-checkout',
    imports: [
        MatButtonModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule
    ],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  readonly dialog = inject(MatDialog);

  openCustomerLoginDialog() {
    const dialogRef = this.dialog.open(CustomerlogindialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCustomerSignUpDialog() {
    const dialogRef = this.dialog.open(CustomersignupdialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    
  });
  secondFormGroup = this._formBuilder.group({
    
  });
  thirdFormGroup = this._formBuilder.group({
    
  });
  isEditable = false;

}
