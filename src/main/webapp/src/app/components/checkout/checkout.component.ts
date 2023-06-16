import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService} from "../../services/form.service";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";
import {Customer} from "../../common/customer";
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../../common/payment-info";
import {byCountry} from "country-code-lookup"

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths: string[] = [];
  creditCardYears: number[] = [];
  checkoutFormGroup!: FormGroup;

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
  isDisabled: boolean = false;
  sessionStorage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private formService: FormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get phoneCountryPrefix() {
    return this.checkoutFormGroup.get('customer.phoneCountryPrefix');
  }

  get phoneNumber() {
    return this.checkoutFormGroup.get('customer.phoneNumber');
  }

  get country() {
    return this.checkoutFormGroup.get('address.country');
  }

  get city() {
    return this.checkoutFormGroup.get('address.city');
  }

  get address() {
    return this.checkoutFormGroup.get('address.address');
  }

  get address2() {
    return this.checkoutFormGroup.get('address.address2');
  }

  get state() {
    return this.checkoutFormGroup.get('address.state');
  }

  get postalCode() {
    return this.checkoutFormGroup.get('address.postalCode');
  }

  ngOnInit(): void {
    this.setupPaymentForm();
    const userEmail = JSON.parse(this.sessionStorage.getItem('userEmail') as string);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{1,19}')]),
        lastName: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{1,19}')]),
        email: new FormControl(userEmail, [Validators.required, Validators.pattern('[A-z0-9-+_]+@([a-z0-9-+_]+\\.){1,4}[a-z0-9-+_]{2,4}')]),
        phoneCountryPrefix: new FormControl('', [Validators.required, Validators.pattern('\\+\\d{2,3}')]),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern('\\d{9}')]),
      }),
      address: this.formBuilder.group({
        country: new FormControl('Poland', [Validators.required, Validators.pattern('[A-Z]{1,2}[a-z]{0,19}(\\s{0,1}[A-Z]{1}[a-z]{1,19})?')]),
        city: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{1,19}(\\s{0,1}[A-Z]{1}[a-z]{1,19}){0,2}')]),
        address: new FormControl('', [Validators.required, Validators.pattern('[A-z0-9\\s]+')]),
        address2: new FormControl('', [Validators.pattern('[A-z0-9\s.-]+')]),
        state: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{1,19}(\\s{0,1}[A-Z]{1}[a-z]{1,19})?')]),
        postalCode: new FormControl('', [Validators.required, Validators.pattern('\\d{2}-\\d{3}')]),
      })
    });
    const startMonth: number = new Date().getMonth() + 1;
    this.formService.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data);
    this.formService.getCreditCardYears().subscribe(data => this.creditCardYears = data);
    this.subscribeToTotals();
  }

  subscribeToTotals() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
  }

  onSubmit() {
    let purchase = this.getPopulatedPurchase();
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.address.address,
                    line2: purchase.address.address2,
                    city: purchase.address.city,
                    state: purchase.address.state,
                    postal_code: purchase.address.postalCode,
                    country: byCountry(purchase.address.country)!.fips
                  }
                }
              }
            }, {handleActions: false})
            .then((result: any) => {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: response => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: err => {
                    alert(`There was an error: ${err.message}. Please try again or contact with us`);
                    this.isDisabled = false;
                  }
                });
              }
            })
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  getPopulatedPurchase(): Purchase {
    return new Purchase(this.getPopulatedCustomer(),
      this.getFormValuesByGroupName('address'),
      this.getPopulatedOrder(),
      this.getPopulatedOrderItems());
  }

  getPopulatedCustomer(): Customer {
    let customer: Customer = this.getFormValuesByGroupName('customer');
    customer.phoneNumber = this.getFormValuesByGroupName('customer').phoneCountryPrefix + customer.phoneNumber;
    return customer;
  }

  getPopulatedOrder(): Order {
    return new Order(this.totalQuantity, this.totalPrice);
  }

  getPopulatedOrderItems(): OrderItem[] {
    return this.cartService.cartItems.map(item => new OrderItem(item))
  }

  getFormValuesByGroupName(name: string): any {
    return this.checkoutFormGroup.controls[name].value;
  }

  private resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);
    this.cartService.persistCartItems();
    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products")
  }

  private setupPaymentForm() {
    let elements = this.stripe.elements();
    this.cardElement = elements.create('card', {hidePostalCode: true});
    this.cardElement.mount('#card-element');
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }
}
