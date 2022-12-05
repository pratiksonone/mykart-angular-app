import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared-services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartItemsLength: any;
  showSearchBar: boolean = false;

  constructor(private sharedService: SharedService, private router: Router) {
    sharedService.cartItemsLength.subscribe((length) => {
      this.cartItemsLength = length;
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.showSearchBar = val.url === '/home';
      }
    });
  }

  getProductsBySearch(searchText: any) {
    this.sharedService.searchText.next(searchText.value.trim());
    searchText.value = '';
  }
}
