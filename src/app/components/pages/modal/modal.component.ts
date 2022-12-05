import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared-services/shared.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  constructor(private sharedService: SharedService, private router: Router) {}

  ngOnInit(): void {}

  closeModal() {
    this.sharedService.alreadyAdded.next(false);
  }

  goToCart() {
    this.router.navigateByUrl('cart');
    this.sharedService.alreadyAdded.next(false);
  }
}
