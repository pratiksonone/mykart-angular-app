import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared-services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  TotalProductsLength: number = 0;
  cartIsEmpty: boolean = true;
  totalPrice: number = 0;
  discountPrice: number = 0;
  totalDiscountedPrice: number = 0;
  productQuantity: any = 1;
  stopCounter: boolean = true;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.cartItems.subscribe((items) => {
      this.cartItems = items;
    });
    this.TotalProductsLength = this.cartItems.length;
    this.cartIsEmpty = this.TotalProductsLength > 0 ? false : true;
    this.cartItems.forEach((item) => {
      this.totalPrice += item.price * 80;
      this.totalDiscountedPrice +=
        item.price * 80 - (item.discountPercentage / 100) * (item.price * 80);
    });
    this.discountPrice = this.totalPrice - this.totalDiscountedPrice;
  }

  removeProduct(index: number) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'Product will be deleted permenently from cart!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      confirmButtonColor: '#E03545',
      cancelButtonText: 'No, keep it',
    }).then((result: any) => {
      if (result.value) {
        const selectedProduct = this.cartItems[index];
        const TotalPriceOfItem = selectedProduct.price * 80;
        console.log(TotalPriceOfItem);
        const DiscountedPriceOfItem =
          selectedProduct.price * 80 -
          (selectedProduct.discountPercentage / 100) *
            (selectedProduct.price * 80);
        this.totalPrice = this.totalPrice - TotalPriceOfItem;
        this.totalDiscountedPrice =
          this.totalDiscountedPrice - DiscountedPriceOfItem;
        this.cartItems.splice(index, 1);
        this.TotalProductsLength = this.cartItems.length;
        this.sharedService.cartItemsLength.next(this.cartItems.length);
        this.cartIsEmpty = this.cartItems.length > 0 ? false : true;
        this.sharedService.removeFromCart(this.cartItems);
        Swal.fire(
          'Deleted!',
          'Product has been deleted from your cart!',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your product is Safe!', 'error');
      }
    });
  }

  addQuantity(operation: string, input: any, id: number) {
    this.stopCounter = false;

    const getUpdatedPrice = (value: number, id: number) => {
      const product = this.cartItems.find((item) => {
        return id === item.id;
      });

      this.totalPrice += product.price * value * 80 - product.price * 80;
      this.totalDiscountedPrice +=
        product.price * 80 * value -
        (product.discountPercentage / 100) * (product.price * 80 * value) -
        (product.price * 80 -
          (product.discountPercentage / 100) * (product.price * 80));
    };

    if (operation === 'increase') {
      this.productQuantity++;
      getUpdatedPrice(2, id);
    } else {
      if (this.productQuantity > 1) {
        this.productQuantity--;
        getUpdatedPrice(0, id);
      } else {
        this.stopCounter = true;
        return;
      }
    }
    input.value = this.productQuantity;
  }

  checkout() {
    Swal.fire({
      title: 'Delivery details',
      width: 800,
      heightAuto: true,
      showCloseButton: true,
      confirmButtonText: 'Place Order',
      confirmButtonColor: 'orange',
      html: `
      <div class="row mt-2 mx-3" style="margin-top:25px ;">
          <div class="col-md-12 justify-content-center">
            <div class="card card-custom">
             <div class="card-body m-0 px-5 bg-primary bg-opacity-75 text-white border border-3">
              <div class="text-center pb-2 my-2">
               <h4 class="text-white bg-dark py-1">Address Details</h4>
              </div>
       <form class="mb-0"> 
          <div class="row mb-2">
            <div class="col">
              <div class="form-outline">
                <input type="text" id="form9Example1" class="form-control input-custom" />
                <label class="form-label" for="form9Example1">First name</label>
              </div>
            </div>
            <div class="col">
              <div class="form-outline">
                <input type="text" id="form9Example2" class="form-control input-custom" />
                <label class="form-label" for="form9Example2">Last name</label>
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4">
              <div class="form-outline">
                <input type="text" id="form9Example3" class="form-control input-custom" />
                <label class="form-label" for="form9Example3">City</label>
              </div>
            </div>
            <div class="col-3">
              <div class="form-outline">
                <input type="text" id="form9Example4" class="form-control input-custom" />
                <label class="form-label" for="form9Example4">Zip</label>
              </div>
            </div>
            <div class="col-5">
              <div class="form-outline">
                <input type="email" id="typeEmail" class="form-control input-custom" />
                <label class="form-label" for="typeEmail">Email</label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-outline">
                <input type="text" id="form9Example6" class="form-control input-custom" />
                <label class="form-label" for="form9Example6">Address</label>
              </div>
            </div>
          </div>
            <div class="form-check d-flex justify-content-center mb-2">
            <input class="form-check-input me-2" type="radio" value="" id="form7Example8" checked />
            <label class="form-check-label" for="form7Example8">
              Cash On Delivery
            </label>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
`,
      preConfirm: () => {
        this.cartItems = [];
        this.TotalProductsLength = this.cartItems.length;
        this.sharedService.cartItemsLength.next(this.cartItems.length);
        this.cartIsEmpty = this.cartItems.length > 0 ? false : true;
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        Swal.fire(
          'Ordered Succesfully!',
          'Product will reach to you in 7 Days',
          'success'
        );
      },
    });
  }
}
