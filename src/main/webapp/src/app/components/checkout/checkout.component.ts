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

  get cardNumber() {
    return this.checkoutFormGroup.get('cardDetails.cardNumber');
  }

  get expirationMonth() {
    return this.checkoutFormGroup.get('cardDetails.expirationMonth');
  }

  get expirationYear() {
    return this.checkoutFormGroup.get('cardDetails.expirationYear');
  }

  get cvv() {
    return this.checkoutFormGroup.get('cardDetails.cvv');
  }

  get cardHolderName() {
    return this.checkoutFormGroup.get('cardDetails.cardHolderName');
  }

  get isRemember() {
    return this.checkoutFormGroup.get('cardDetails.isRemember');
  }

  ngOnInit(): void {
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
        country: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{1,19}(\\s{0,1}[A-Z]{1}[a-z]{1,19})?')]),
        city: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{1,19}(\\s{0,1}[A-Z]{1}[a-z]{1,19}){0,2}')]),
        address: new FormControl('', [Validators.required, Validators.pattern('[A-z0-9\\s]+')]),
        address2: new FormControl('', [Validators.pattern('[A-z0-9]+')]),
        state: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{1,19}(\\s{0,1}[A-Z]{1}[a-z]{1,19})?')]),
        postalCode: new FormControl('', [Validators.required, Validators.pattern('\\d{2}-\\d{3}')]),
      }),
      cardDetails: this.formBuilder.group({
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('(\\d{4}\\s{0,1}){4}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
        cvv: new FormControl('', [Validators.required, Validators.pattern('\\d{3}')]),
        cardHolderName: new FormControl('', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{1,19}\\s[A-Z]{1}[a-z]{1,19}')]),
        isRemember: [false],
      }),
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
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let purchase = this.getPopulatedPurchase();
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received. Order tracking number: ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err => {
        alert(`There was an error: ${err.message}. Please try again or contact with us`)
      }
    });
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

  handleMonthAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('cardDetails');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data);
  }

  private resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products")
  }
}
