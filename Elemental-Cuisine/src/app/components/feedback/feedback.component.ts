import { Profiles } from 'src/app/classes/enums/profiles';
import { FcmService } from 'src/app/services/fcmService';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { Order } from 'src/app/classes/order';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {

  @Input() currentOrder: Order;
  @Output() sendFeedback: EventEmitter<boolean> = new EventEmitter<boolean>();
  private orders: Array<Order> = new Array<Order>();

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private fcmService: FcmService
  ) { 
    this.orderService.getOrderById(this.authService.getCurrentUser().uid).then(orders => {
      this.orders = []
      if(orders.exists)
        this.orders = Object.values(orders.data());
    });
  }

  ngOnInit() { }

  saveOrder(){
    this.orders.push(this.currentOrder)
    this.orderService.saveOrder(this.authService.getCurrentUser().uid,  this.orders.map((obj)=> {return Object.assign({}, obj)}));
    this.notificationService.presentToast("Pedido realizado con éxito", "success", "top");
    this.fcmService.getTokensByProfile(Profiles.Waiter).then(userDevices => {
      this.fcmService.sendNotification('Nuevo pedido!', 'Se requiere su confirmación', userDevices);
    });
    this.sendFeedback.emit(true);
    this.router.navigateByUrl("/inicio");
  }

}
