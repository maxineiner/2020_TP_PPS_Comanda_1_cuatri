import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Order } from 'src/app/classes/order';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { AlertController } from '@ionic/angular';
import { Status } from 'src/app/classes/enums/Status';
import { NotificationService } from 'src/app/services/notification.service';

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
    private notificationService: NotificationService
  ) { 
    this.currentUser = this.authService.getCurrentUser();
    if (isNullOrUndefined(this.currentUser)) this.router.navigateByUrl("/login");

    this.orderService.getOrderById(this.currentUser.uid).then(orders => {
      this.orders = Object.values(orders.data())
      const reducer = (accumulator, order) => accumulator + order.total;
      this.total = this.orders.reduce(reducer, 0);
    });

  }

  ngOnInit() {
  }

  showDetails(orderIndex){
    const order = this.orders[orderIndex];
    let message = ""
    if(order.statusFood)
      message += `Comidas: ${order.statusFood}<br>`
    if(order.statusDrink)
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

  payBill(){
    if (this.orders.filter(order => order.statusDrink === Status.Confirmed && order.statusFood === Status.Confirmed).length == this.orders.length){
      this.router.navigateByUrl("/pagar")
    }
    else {
      this.notificationService.presentToast("Para solicitar la cuenta debe confirmar todos los pedidos realizados","warning","middle")
    }

  }

  confirm(orderIndex){
      this.orders[orderIndex].statusFood = Status.Confirmed;
      this.orders[orderIndex].statusDrink = Status.Confirmed;
      
      this.orderService.saveOrder(this.currentUser.uid, this.orders.map((obj)=> {return Object.assign({}, obj)}));
  }
}
