import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/classes/order';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  private orders: Array<Order> = new Array<Order>();
  private menus: Array<any> = new Array<any>();
  private discounts: Array<any> = new Array<any>();
  private total: number;
  private currentUser;
  private tip: number;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
  ) { 
    this.currentUser = this.authService.getCurrentUser();
    if (isNullOrUndefined(this.currentUser)) this.router.navigateByUrl("/login");

    this.orderService.getOrderById(this.currentUser.uid).then(orders => {
      this.orders = Object.values(orders.data())
      this.menus = this.orders.map(order => order.menu).flat()
      const reducer = (accumulator, order) => accumulator + order.total;
      this.total = this.orders.reduce(reducer, 0);
    });

  }

  ngOnInit() {
  }

}
