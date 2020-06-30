import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Order } from 'src/app/classes/order';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { AlertController } from '@ionic/angular';
import { Status } from 'src/app/classes/enums/Status';
import { NotificationService } from 'src/app/services/notification.service';
import { CurrentAttentionService } from 'src/app/services/currentAttention.service';
import { Attention } from 'src/app/classes/attention';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  private orders: Array<Order> = new Array<Order>();
  private total: number;
  Status = Status;
  private currentUser

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private notificationService: NotificationService,
    private attentionService: CurrentAttentionService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    if (isNullOrUndefined(this.currentUser)) this.router.navigateByUrl("/login");
    this.attentionService.getAttentionById(this.currentUser.uid).then(currentAttention => {
      let attention = currentAttention.data() as Attention;
      if (attention.billRequested) this.router.navigateByUrl("/pagar");
      this.orderService.getOrder(this.currentUser.uid).subscribe(orders => {
        this.total = 0;
        if(!orders) return;
        this.orders = Object.values(orders);
        const reducer = (accumulator, order) => accumulator + order.total;
        this.total = this.orders.reduce(reducer, 0);
      });
    })
  }

  ngOnInit() {
  }

  showDetails(orderIndex) {
    const order = this.orders[orderIndex];
    let message = ""
    if (order.statusFood)
      message += `Comidas: ${order.statusFood}<br>`
    if (order.statusDrink)
      message += `Bebidas: ${order.statusDrink}`
    this.showAlert(message)
  }

  async showAlert(message) {
    const alert = await this.alertController.create({
      header: "Su pedido está en estado:",
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  payBill() {
    if (this.orders.filter(order => order.statusDrink === Status.Confirmed && order.statusFood === Status.Confirmed).length == this.orders.length) {
      this.router.navigateByUrl("/pagar")
    }
    else {
      this.notificationService.presentToast("Para solicitar la cuenta debe confirmar todos los pedidos realizados", "warning", "middle")
    }

  }

  confirm(orderIndex) {
    this.orders[orderIndex].statusFood = Status.Confirmed;
    this.orders[orderIndex].statusDrink = Status.Confirmed;

    this.orderService.saveOrder(this.currentUser.uid, this.orders.map((obj) => { return Object.assign({}, obj) }));
  }

  validateOrder(order){
    return ((order.statusFood != Status.Confirmed && order.statusFood != Status.Delivered) ||
      (order.statusDrink != Status.Confirmed && order.statusDrink != Status.Delivered))
  }
}
