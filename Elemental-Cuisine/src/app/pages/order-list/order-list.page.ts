import { Product } from './../../classes/product';
import { FcmService } from './../../services/fcmService';
import { OrderService } from 'src/app/services/order.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Status } from 'src/app/classes/enums/Status';
import { TypeNotification } from 'src/app/classes/enums/TypeNotification';
import { Order } from 'src/app/classes/order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {

  /* #region  Atributos */

  pendingConfirmOrders: Array<OrderWithUser> = Array<OrderWithUser>();
  pendingPreparationOrders: Array<OrderWithUser> = Array<OrderWithUser>();
  preparingOrders: Array<OrderWithUser> = Array<OrderWithUser>();
  preparedOrders: Array<OrderWithUser> = Array<OrderWithUser>();
  Status = Status;
  /* #endregion */

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private orderService: OrderService,
    private fcmService: FcmService
  ) { }

  ngOnInit() {
    this.getOrders();
  }

  /* #region  Métodos */

  private getOrders(): void {

    this.orderService.getAllOrders().subscribe(ordersData => {

      let allMiniOrers = [];

      ordersData.map(ordersData => {
        let orders = Object.values(ordersData.payload.doc.data()) as Order[];
        let miniOrder = Object.values(orders) as Order[];
        miniOrder.forEach(order => {
          let orderWithUser: OrderWithUser = new OrderWithUser();
          order.id = ordersData.payload.doc.id
          orderWithUser.order = order;
          orderWithUser.index = miniOrder.indexOf(order);
          this.userService.getUserById(order.id).then(user => orderWithUser.user = user.data() as User);
          allMiniOrers.push(orderWithUser);
        });
        return miniOrder;
      });

      this.pendingConfirmOrders = allMiniOrers.filter(miniOrder => miniOrder.order.status === Status.PendingConfirm);
      this.pendingPreparationOrders = allMiniOrers.filter(miniOrder => miniOrder.order.status === Status.PendingPreparation);
      this.preparingOrders = allMiniOrers.filter(miniOrder => miniOrder.order.status === Status.Preparing);
      this.preparedOrders = allMiniOrers.filter(miniOrder => miniOrder.order.status === Status.Prepared);

    });
  }

  updateOrderStatus(orderId: string, index: number, status: Status): void {

    this.orderService.getOrderById(orderId).then(orderData => {
      let orders = orderData.data() as Order[];
      orders[index].statusFood = status;
      this.orderService.modifyOrder(orderId, orders);

    
      switch (status) {

        case Status.PendingPreparation:
          let products = orders[index].menu as Product[];
          this.sendNotificationByProfile(products);
          this.notificationService.presentToast('El pedido fue confirmado!', TypeNotification.Success, "bottom", false);
          break;

        case Status.Delivered:
          this.notificationService.presentToast('El pedido fue entregado con éxito!', TypeNotification.Info, "bottom", false);
          break;

        case Status.Cancelled:
          this.notificationService.presentToast('La orden fue cancelada', TypeNotification.Error, "bottom", false);
          break;

      }
    });
  }

  private sendNotificationByProfile(products: Product[]): void {
    products.forEach(product => {
      this.fcmService.getTokensByProfile(product.managerProfile).then(userDevices => {
        this.fcmService.sendNotification(
          "Nuevo pedido!",
          `${product.name} ${product.description}`,
          userDevices);
      });
    })
  }

}

/* #endregion */

// Es una clase auxiliar para relacionar el pedido con un usuario
class OrderWithUser {
  id: string;
  index: number;
  order: Order;
  user: User;
}