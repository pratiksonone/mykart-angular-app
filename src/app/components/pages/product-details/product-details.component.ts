import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/api-services/products.service';
import { NgbCarouselConfig, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared-services/shared.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  providers: [NgbCarouselConfig, NgbRatingConfig],
})
export class ProductDetailsComponent implements OnInit {
  data: any = [];
  selectedProductData: any = [];
  currentProductId: number = 0;
  productAddedToCart: any;
  alreadyPresentInCart: boolean = false;

  constructor(
    private productsData: ProductsService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    config: NgbRatingConfig
  ) {
    config.max = 5;
    config.readonly = true;
    sharedService.alreadyAdded.subscribe((value) => {
      this.alreadyPresentInCart = value;
      this.productAddedToCart = value;
    });
  }

  ngOnInit(): void {
    this.currentProductId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
    this.productsData.getProductsData().subscribe((data) => {
      this.data = data;
      this.selectedProductData = this.data.products[this.currentProductId - 1];
    });
  }

  backToProducts() {
    this.router.navigateByUrl('home');
  }

  addToCart() {
    this.selectedProductData.quantity = 1;
    this.sharedService.addToCart(this.selectedProductData);
    this.productAddedToCart = true;
  }
}
