import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {Product} from "../../common/product";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  animations: [
    trigger('simpleOnClickAnimation', [
      state('normal', style({
      })),
      state('clicked', style({
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      })),
      transition('normal => clicked', [
        animate('200ms')
      ]),
      transition('clicked => normal', [
        animate('200ms')
      ]),
    ])
  ]
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  animationState = 'normal';

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }

  toggleAnimationState() {
    if (this.animationState === 'normal') {
      this.animationState = 'clicked';

      setTimeout(() => {
        this.animationState = 'normal';
      }, 200);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProduct();
    })
  }

  getProduct() {
    const theProductId = +this.route.snapshot.paramMap.get("id")!;
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      });
  }

  addToCart() {
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
