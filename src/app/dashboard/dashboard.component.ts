import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faShop } from '@fortawesome/free-solid-svg-icons';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  faGauge = faGauge;
  faList = faList;
  faShop = faShop;
  faTruck = faTruck;
  faUser = faUser;
  faUserGear = faGears;
  faRightFromBracket = faRightFromBracket;

  tog() {
    $(".sidenav").toggleClass("toggle");
    $(".main-content").toggleClass("toggle-main");
    $(".sidenav").toggleClass("active");
    $(".navbar").toggleClass("toggle-main");
    $(".routeOverlay").toggleClass("routeOverlayActive");
  }

}
