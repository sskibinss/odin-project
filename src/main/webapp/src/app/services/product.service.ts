import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'

  constructor(private httpClient: HttpClient) {
  }

  getProductList(currentCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;
    return this.handleGetCall(searchUrl);
  }

  searchForProducts(userInput: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${userInput}`;
    return this.handleGetCall(searchUrl);
  }

  getProduct(productId: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);
  }

  handleGetCall(searchUrl: string) {
    return this.httpClient.get<GetProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetProducts {
  _embedded: {
    products: Product[];
  }
}
