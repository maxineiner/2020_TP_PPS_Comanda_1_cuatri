import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {
  
  private order: any = {};
  private isOrderTaked: boolean = false;
  private isRouteSelected: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  setOrderMenu(order){
    this.order.price = order.price;
    this.order.menu = order.menu;
    this.isOrderTaked = true;
  }

  setOrderTime(route){
    this.order.time = route.time;
    this.order.destination = route.destination;
    this.isRouteSelected = true;
  }
}
