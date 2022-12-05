import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  @Input('errorMessage') errorMessage: string = '';
  @Input('ErrorStatus') errorStatus: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToHome() {
    this.router.navigateByUrl('home');
  }
}
