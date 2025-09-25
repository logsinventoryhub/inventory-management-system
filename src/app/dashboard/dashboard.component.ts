import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { 
  faBasketShopping, faGauge, faStore, faList, faShop, faTruck, 
  faUser, faGears, faRightFromBracket, faCartShopping, faIndustry 
} from '@fortawesome/free-solid-svg-icons';
import { CommunicatorService } from '../communicator.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [RouterModule, CommonModule],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  faGauge = faGauge;
  faList = faList;
  faShop = faShop;
  faTruck = faTruck;
  faUser = faUser;
  faUserGear = faGears;
  faRightFromBracket = faRightFromBracket;
  faBasketShopping = faBasketShopping;
  faCartShopping = faCartShopping;
  faIndustry = faIndustry;
  faStore = faStore;

  cookieValue: string = '';
  user_data: any[] = [];
  username: string = '';
  admin: boolean;
  manager: boolean;
  staff: boolean;
  role: string = "";
  business: string = "";
  business_id: number;
  notificationCount: number = 0;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private communicatorService: CommunicatorService
  ) {}

  ngOnInit(): void {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');

    if (this.cookieValue) {
      const API_JSON_DATA = {
        token: this.cookieValue,
        key: 'GET_USER_DATA'
      };
      this.communicatorService.onSubmitService(API_JSON_DATA).subscribe({
        next: (res: any) => {
          this.communicatorService.setData({user: res.user, profile: res.profile, member: res.member, business: res.business, categories: res.categories, locations: res.locations});
          this.user_data = res.user || [];
          if (this.user_data.length > 0) {
            this.username = this.user_data[0].username || '';
          } else {
            this.username = '';
          }
          if (res.member[0].role_id === 1) {
            this.role = "admin";
            this.admin = true;
          } else if (res.member[0].role_id === 2) {
            this.role = "manager";
            this.manager = true;
          } else if (res.member[0].role_id === 3) {
            this.role = "staff";
            this.staff = true;
          } else {
            this.role = "";
          }
          this.business = res.business[0].name;
          this.business_id = res.business[0].id;
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
    }

    this.loadExternalScript('assets/libs/simplebar/simplebar.min.js');
    this.loadExternalScript('assets/libs/apexcharts/apexcharts.min.js');
    this.loadExternalScript('assets/js/pages/ecommerce-index.init.js');
    this.loadExternalScript('assets/js/app.js');
  }

  logout(): void {
    this.cookieService.delete('Logs_Cookie_data');
    this.router.navigate(['/']);
  }

  loadExternalScript(src: string): void {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      console.log(`Script loaded: ${src}`);
    };
    document.body.appendChild(script);
  }
}
