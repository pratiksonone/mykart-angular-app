import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  url = 'https://dummyjson.com/products?limit=100';

  constructor(private http: HttpClient) {}

  getProductsData() {
    return this.http.get(this.url);
  }
}
