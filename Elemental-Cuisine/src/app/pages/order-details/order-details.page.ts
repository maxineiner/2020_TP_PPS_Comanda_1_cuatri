import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Order } from 'src/app/classes/order';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  private orders: Array<Order> = new Array<Order>();
  private total: number;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) { 
    this.total = 0;
    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) this.router.navigateByUrl("/login");

    this.orderService.getOrderById(user.uid).then(orders => {
      this.orders = Object.values(orders.data())
      const reducer = (accumulator, order) => accumulator + order.total;
      this.total = this.orders.reduce(reducer, this.total);
    });

  }

  ngOnInit() {
  }

  showDetails(){

  }

}
