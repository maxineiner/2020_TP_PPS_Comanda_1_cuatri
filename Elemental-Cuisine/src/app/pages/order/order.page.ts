import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  private order: any = {};
  private isOrderTaked: boolean = false;

  constructor( ) { }

  ngOnInit() {
  }

  setOrderMenu(order){
    this.order.price = order.price;
    this.order.menu = order.menu;
    this.isOrderTaked = true;
  }
}