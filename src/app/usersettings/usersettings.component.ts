import { ChangeDetectionStrategy, Component, signal, inject, model } from '@angular/core';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
    selector: 'app-usersettings',
    imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatIconModule,
        NgxSpinnerModule
    ],
    templateUrl: './usersettings.component.html',
    styleUrl: './usersettings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersettingsComponent {
  // A CONSTRUCTOR METHOD THAT RUNS BEFORE THE WEBPAGE LOADS
  constructor(private spinner: NgxSpinnerService) {}
  hide = signal(true);
    clickEvent(event: MouseEvent) {
      this.hide.set(!this.hide());
      event.stopPropagation();
    }
  
    readonly allow = model(false);
    readonly deny = model(false);
    readonly labelPosition = model<'before' | 'after'>('after');

}
