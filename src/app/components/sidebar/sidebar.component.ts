import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  selectedCategoryIndex: number = 0;
  @Input('categories') categories: any[] = [];
  @Output('category') category = new EventEmitter<string>();

  priceFilters = [
    'Below 1000',
    '1000 - 5000',
    '5000 - 15,000',
    '15,000 - 50,000',
    'Above 50,000',
  ];

  constructor() {}

  ngOnInit(): void {}

  getProducts(category: string, index: number) {
    this.category.emit(category);
    this.selectedCategoryIndex = index;
  }
}
