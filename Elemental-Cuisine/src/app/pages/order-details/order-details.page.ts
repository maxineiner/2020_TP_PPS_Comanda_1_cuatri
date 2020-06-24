import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Order } from 'src/app/classes/order';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { AlertController } from '@ionic/angular';
import { Status } from 'src/app/classes/enums/Status';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  private orders: Array<Order> = new Array<Order>();
  private total: number;
  Status = Status;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
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

  showDetails(orderIndex){
    this.showAlert(this.orders[orderIndex])
  }

  async showAlert(order) {
    const alert = await this.alertController.create({
      header: "Su pedido está en estado:",
      message: order.statusFood + " " + order.statusDrink ,
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

  }

  confirm(orderIndex){

  }
}
