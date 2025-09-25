import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';


@Component({
  selector: 'app-customersignupdialog',
  imports: [MatDialogModule],
  templateUrl: './customersignupdialog.component.html',
  styleUrl: './customersignupdialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersignupdialogComponent {

}
