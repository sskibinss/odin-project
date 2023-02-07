import {Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ProductListComponent} from './components/product-list/product-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ProductService} from "./services/product.service";
import {Router, RouterModule, Routes} from "@angular/router";
import {ProductCategoryMenuComponent} from './components/product-category-menu/product-category-menu.component';
import {SearchComponent} from './components/search/search.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CartStatusComponent} from './components/cart-status/cart-status.component';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from './components/login/login.component';
import {LoginStatusComponent} from './components/login-status/login-status.component';

import {OKTA_CONFIG, OktaAuthGuard, OktaAuthModule, OktaCallbackComponent} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";

import appConfig from "./config/app-config";
import {MembersPageComponent} from './components/members-page/members-page.component';
import {OrderHistoryComponent} from './components/order-history/order-history.component';
import {AuthInterceptorService} from "./services/auth-interceptor.service";
import {AboutUsComponent} from './components/about-us/about-us.component';
import {ContactUsComponent} from './components/contact-us/contact-us.component';

const oktaConfig = appConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

function sentToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  const router = injector.get(Router);
  router.navigateByUrl("/login");
}

const routes: Routes = [
  {
    path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard],
    data: {onAuthRequired: sentToLoginPage}
  },
  {
    path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard],
    data: {onAuthRequired: sentToLoginPage}
  },
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'categories/:id', component: ProductListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:userInput', component: ProductListComponent},
  {path: 'categories', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: '', redirectTo: '/products', pathMatch: "full"},
  {path: '**', redirectTo: '/products', pathMatch: "full"}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    AboutUsComponent,
    ContactUsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: {oktaAuth}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
