import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatTabsModule, RouterModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  faEnvelope = faEnvelope;
  faKey = faKey;

  login(loginInfo: NgForm) {
    let login_info = {
      email: loginInfo.value.email,
      password: loginInfo.value.password
    }
    console.log(login_info)
  }

}
