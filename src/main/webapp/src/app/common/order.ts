export class Order {
  totalQuantity: number = 0;
  totalPrice: number = 0.00;

  constructor(totalQuantity: number, totalPrice: number) {
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }
}
