import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CategoryComponent } from './category/category.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { TransfersComponent } from './transfers/transfers.component';
import { UsersComponent } from './users/users.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
        { path: '', component: AnalyticsComponent},
        { path: 'analytics', component: AnalyticsComponent},
        { path: 'categories', component: CategoriesComponent, children: [
            { path: 'newcategory', component: CategoryComponent }
        ]},
        { path: 'products', component: ProductsComponent },
        { path: 'transfers', component: TransfersComponent },
        { path: 'users', component: UsersComponent },
        { path: 'settings', component: SettingsComponent}
    ]}
];
