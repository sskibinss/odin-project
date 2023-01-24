import {Product} from './product';

describe('Product', () => {
  it('should create an instance', () => {
    expect(new Product("sku", "name", "desc", "100.00", "imageUrl", true, 30, Date.prototype, Date.prototype)).toBeTruthy();
  });
});
