import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/classes/order';
import { isNullOrUndefined } from 'util';
import { CurrentAttentionService } from 'src/app/services/currentAttention.service';
import { Categories } from 'src/app/classes/enums/categories';
import { Attention } from 'src/app/classes/attention';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  private orders: Array<Order> = new Array<Order>();
  private menus: Array<any> = new Array<any>();
  private attention: Attention;
  private freeDrink: any;
  private freeDessert: any;
  private total: number;
  private currentUser;
  private tip: number;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private attentionService: CurrentAttentionService
  ) { 
    this.currentUser = this.authService.getCurrentUser();
    if (isNullOrUndefined(this.currentUser)) this.router.navigateByUrl("/login");
    const userId = this.currentUser.uid
    this.orderService.getOrderById(userId).then(orders => {
      this.orders = Object.values(orders.data())
      this.menus = this.orders.map(order => order.menu).flat()
      const totalReducer = (accumulator, order) => accumulator + order.total;
      this.total = this.orders.reduce(totalReducer, 0);
      
      const discountReducer = (prev, curr) => prev.price < curr.price ? prev : curr
      const drinks = this.menus.filter(menu => menu.category == Categories.Drink)
      this.freeDrink = (drinks.length > 0) ? drinks.reduce(discountReducer) : undefined
      const desserts = this.menus.filter(menu => menu.category == Categories.Dessert)
      this.freeDessert = (desserts.length > 0) ? desserts.reduce(discountReducer) : undefined

      this.attentionService.getAttentionById(userId).then(currentAttention => {
        this.attention = currentAttention.data() as Attention;
      })
    });

  }

  ngOnInit() {
  }

  payBill(){
    this.attention.billRequested = true;
    this.attentionService.modifyAttention(this.currentUser.uid, this.attention);
  }

  getTotal(){
    const discount = (this.attention && this.attention.discount) ? this.total * 10 / 100 : 0;
    const freeItems = (this.freeDessert && this.freeDessert.price) ? this.freeDessert.price : 0 + (this.freeDrink && this.freeDrink.price) ? this.freeDrink.price : 0;
    const tip = (this.tip) ? (this.total - discount - freeItems) * this.tip / 100 : 0;
    const total = this.total - discount - freeItems + tip;
    return total;
  }

}
