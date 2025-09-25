import { AnalyticsComponent } from './analytics/analytics.component';
import { NewtransferComponent } from './newtransfer/newtransfer.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { TransfersComponent } from './transfers/transfers.component';
import { UsersComponent } from './users/users.component';
import { SettingsComponent } from './settings/settings.component';
import { NewuserComponent } from './newuser/newuser.component';
import { NewproductComponent } from './newproduct/newproduct.component';
import { UsersettingsComponent } from './usersettings/usersettings.component';
import { ShopComponent } from './shop/shop.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ShopnavigationComponent } from './shopnavigation/shopnavigation.component';
import { OrdersComponent } from './orders/orders.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { NewpurchaseComponent } from './newpurchase/newpurchase.component';
import { NewsupplierComponent } from './newsupplier/newsupplier.component';
import { AuthGuard } from './auth.guard';
import { ProductspreadsheetComponent } from './productspreadsheet/productspreadsheet.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { AddwarehouseComponent } from './addwarehouse/addwarehouse.component';
import { NeworderComponent } from './neworder/neworder.component';
import { SubscriptiontiersComponent } from './subscriptiontiers/subscriptiontiers.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { CustomersComponent } from './customers/customers.component';
import { NewcustomerComponent } from './newcustomer/newcustomer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';

export const routes: Routes = [
    { path: '', component: NavComponent},
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'recover-password', component: RecoveryComponent },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
            { path: '', component: AnalyticsComponent, canActivate: [AuthGuard] },
            { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard], pathMatch: 'full' },
            { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
            { path: 'newcategory', component: CategoryComponent, canActivate: [AuthGuard] },
            { path: 'newtransfer', component: NewtransferComponent, canActivate: [AuthGuard] },
            { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
            { path: 'newproduct', component: NewproductComponent, canActivate: [AuthGuard] },
            { path: 'transfers', component: TransfersComponent, canActivate: [AuthGuard] },
            { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
            { path: 'newuser', component: NewuserComponent, canActivate: [AuthGuard] },
            { path: 'usersettings', component: UsersettingsComponent, canActivate: [AuthGuard] },
            { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
            { path: 'sales', component: OrdersComponent, canActivate: [AuthGuard] },
            { path: 'purchases', component: PurchasesComponent, canActivate: [AuthGuard] },
            { path: 'suppliers', component: SuppliersComponent, canActivate: [AuthGuard] },
            { path: 'newpurchase', component: NewpurchaseComponent, canActivate: [AuthGuard] },
            { path: 'newsupplier', component: NewsupplierComponent, canActivate: [AuthGuard] },
            { path: 'importproductspreadsheet', component: ProductspreadsheetComponent, canActivate: [AuthGuard] },
            { path: 'store', component: WarehouseComponent, canActivate: [AuthGuard] },
            { path: 'addwarehouse', component: AddwarehouseComponent, canActivate: [AuthGuard] },
            { path: 'neworder', component: NeworderComponent, canActivate: [AuthGuard] },
            { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard]},
            { path: 'newcustomer', component: NewcustomerComponent, canActivate: [AuthGuard]}
        ]
    },
    { path: 'subscription', component: SubscriptiontiersComponent },
    {
        path: 'shop', component: ShopnavigationComponent, children: [
            { path: '', component: ShopComponent },
            { path: 'checkout', component: CheckoutComponent }
        ]
    },
    { path: 'logs', component: NavigationComponent, children: [
        { path: '', component: TermsOfServiceComponent},
        { path: 'terms-of-service', component: TermsOfServiceComponent},
        { path: 'privacy-policy', component: PrivacyPolicyComponent},
        { path: 'refund-policy', component: RefundPolicyComponent}
        
    ]},
    { path: 'product-gallery/:id/:business', component: ProductGalleryComponent},
    { path: 'cart/:id/:business', component: CartComponent },
];
