import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/classes/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  private order: Order;
  private isOrderTaked: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  setOrderMenu(order) {
    this.order = order;
    this.isOrderTaked = true;
  }

  clearComponent() {
    this.order = undefined;
    this.isOrderTaked = false;
  }
}