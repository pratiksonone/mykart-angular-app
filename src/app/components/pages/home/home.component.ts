import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/api-services/products.service';
import { SharedService } from 'src/app/services/shared-services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  data: any = [];
  products: any[] = [];
  categories: any[] = [];
  searchText: string = '';
  errorMessage: string = '';
  errorStatus: string = '';
  constructor(
    private productsData: ProductsService,
    private sharedService: SharedService
  ) {
    productsData.getProductsData().subscribe({
      next: (data) => {
        this.data = data;
        this.products = this.data.products;
        this.data.products.forEach((item: any) => {
          this.categories.push(item.category);
        });
        this.categories = this.categories.filter((item, index) => {
          return this.categories.indexOf(item) === index;
        });
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.errorStatus = err.status;
        console.log(err.message);
        console.log(err.status);
      },
    });

    sharedService.searchText.subscribe((text) => {
      this.searchText = text;
    });
  }

  ngOnInit(): void {
    this.sharedService.showNavBar.next(true);
  }

  showProducts(category: string) {
    //to end the search result on clicking filter
    this.sharedService.searchText.next('');

    const getFilteredPriceProducts = (minPrice: number, maxPrice: number) => {
      this.products = this.data.products.filter((item: any) => {
        const productPrice =
          item.price * 80 - (item.discountPercentage / 100) * (item.price * 80);
        return productPrice > minPrice && productPrice < maxPrice;
      });
    };

    if (category === 'all') {
      this.products = this.data.products;
    } else {
      this.products = this.data.products.filter((item: any) => {
        return item.category == category;
      });
    }

    switch (category) {
      case 'Below 1000':
        getFilteredPriceProducts(0, 1000);
        break;
      case '1000 - 5000':
        getFilteredPriceProducts(1000, 5000);
        break;
      case '5000 - 15,000':
        getFilteredPriceProducts(5000, 15000);
        break;
      case '15,000 - 50,000':
        getFilteredPriceProducts(15000, 50000);
        break;
      case 'Above 50,000':
        getFilteredPriceProducts(50000, Math.pow(10, 1000));
        break;
    }
  }
}
