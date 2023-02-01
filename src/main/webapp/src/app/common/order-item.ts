import {CartItem} from "./cart-item";

export class OrderItem {
  imageUrl: string = "";
  unitPrice: number = 0;
  quantity: number = 0;
  productId: number = 0;

  constructor(cartItem: CartItem) {
    this.imageUrl = cartItem.imageUrl;
    this.productId = cartItem.id;
    this.unitPrice = cartItem.unitPrice;
    this.quantity = cartItem.quantity;
  }
}
