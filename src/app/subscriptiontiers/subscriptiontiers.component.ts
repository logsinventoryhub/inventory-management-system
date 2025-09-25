import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-subscriptiontiers',
  imports: [MatButtonModule],
  templateUrl: './subscriptiontiers.component.html',
  styleUrl: './subscriptiontiers.component.scss'
})
export class SubscriptiontiersComponent {
  info() {
    alert("Module Under Development!")
  }
}
