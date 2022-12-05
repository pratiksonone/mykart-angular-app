import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: any;
  images: [];
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  placeHolder: Product[] = [];
  cartItems = new BehaviorSubject<Product[]>([]);
  alreadyAdded = new BehaviorSubject<boolean>(false);
  cartItemsLength = new BehaviorSubject<number>(0);
  searchText = new Subject<string>();
  selectedProduct = new Subject<[]>();
  showNavBar = new BehaviorSubject<boolean>(false);

  constructor() {
    const localStorageItems = localStorage.getItem('cartItems');
    if (localStorageItems) {
      const cartProductsData = JSON.parse(localStorageItems);
      this.cartItems.next(cartProductsData);
      this.cartItemsLength.next(cartProductsData.length);
    }
  }

  addToCart(product: Product) {
    const localStorageItems = localStorage.getItem('cartItems');
    let productExist;
    let cartData;

    if (localStorageItems) {
      cartData = JSON.parse(localStorageItems);
      productExist = cartData.find((item: any) => {
        return item.id === product.id;
      });
    }

    if (!productExist) {
      if (localStorageItems) {
        const updatedCartData = [...cartData, product];
        localStorage.setItem('cartItems', JSON.stringify(updatedCartData));
        const updatedLocalStorageData = localStorage.getItem('cartItems');
        if (updatedLocalStorageData) {
          const newData = JSON.parse(updatedLocalStorageData);
          this.cartItems.next(newData);
          this.cartItemsLength.next(newData.length);
        }
      } else {
        this.placeHolder.push(product);
        localStorage.setItem('cartItems', JSON.stringify(this.placeHolder));
        this.cartItems.next(this.placeHolder);
      }
      this.alreadyAdded.next(false);
      Swal.fire(
        'Added to Cart!',
        'Product added succesfully to the Cart!',
        'success'
      );
    } else {
      this.alreadyAdded.next(true);
    }
  }

  removeFromCart(products: any[]) {
    localStorage.setItem('cartItems', JSON.stringify(products));
  }
}
