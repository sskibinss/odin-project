import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  animations: [
    trigger('simpleOnClickAnimation', [
      state('normal', style({
      })),
      state('clicked', style({
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      })),
      transition('normal => clicked', [
        animate('50ms')
      ]),
      transition('clicked => normal', [
        animate('50ms')
      ]),
    ])
  ]
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  thePageNumber: number = 1;
  thePageSize: number = 8;
  theTotalElements: number = 0;
  animationStates: string[] = [];

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) {
  }

  toggleAnimationState(index: number) {
    if (this.animationStates[index] !== 'clicked') {
      this.animationStates[index] = 'clicked';
      setTimeout(() => {
        this.animationStates[index] = 'normal';
      }, 200);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    const isSearchButtonClicked: boolean = this.route.snapshot.url.toString().includes("search");
    if (isSearchButtonClicked) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
    } else {
      this.currentCategoryId = 0;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        });
  }

  handleSearchProducts() {
    const searchedProductName = this.route.snapshot.paramMap.get("userInput")!;

    this.productService.searchForProductsPaginate(this.thePageNumber - 1, this.thePageSize, searchedProductName).subscribe(data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    });
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
