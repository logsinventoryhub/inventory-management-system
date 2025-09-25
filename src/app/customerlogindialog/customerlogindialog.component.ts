import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-customerlogindialog',
  imports: [MatIconModule, MatDialogModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatGridListModule, NgxSpinnerModule, FontAwesomeModule],
  templateUrl: './customerlogindialog.component.html',
  styleUrl: './customerlogindialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerlogindialogComponent {
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
