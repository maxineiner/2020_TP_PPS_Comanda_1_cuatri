import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { TableService } from 'src/app/services/table.service';
import { FcmService } from 'src/app/services/FcmService';
import { Collections } from 'src/app/classes/enums/collections';
import { NotificationService } from 'src/app/services/notification.service';
import { isNullOrUndefined } from 'util';
import { Profiles } from 'src/app/classes/enums/profiles';
import { Table } from 'src/app/classes/table';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  private order: any = {};
  private isOrderTaked: boolean = false;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private dataService: DataService,
    private tableService: TableService,
    private fcmService: FcmService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  setOrderMenu(order){
    this.order.price = order.price;
    this.order.menu = order.menu;
    this.isOrderTaked = true;
  }

  async askWaiter() {
    const alert = await this.alertController.create({
      header: "Consulta sobre el menú",
      // subHeader: `$${product.price}`,
      message: "Se le notificará su consulta al mozo y este acudirá cuanto antes para resolverla!",
      inputs: [
        {
          name: 'query',
          type: 'text',
          placeholder: 'Ingrese aquí su consulta'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'btnCancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'Consultar',
          handler: (inputs) => {
            alert.dismiss(inputs.query);
            return false;
          }
        }
      ]
    });
    alert.present();

    alert.onDidDismiss().then((data) => {
      if (data.data) {
        this.sendNotificationToWaiter(data.data);
      }
    })
  }

  sendNotificationToWaiter(query) {
    let user = this.authService.getCurrentUser();
    if (!isNullOrUndefined(user))
      this.dataService.getOne(Collections.TableService, user.uid).then(response => {
        this.tableService.getTableById(response.data().tableId).then(table => {
          let currentTable = Object.assign(new Table, table.data());
          this.fcmService.getTokensByProfile(Profiles.Waiter).then(waiterDevices => {
            this.fcmService.sendNotification(
              "Consulta de cliente",
              "Los comenzales en la mesa N.° " + currentTable.number + " tienen la siguiente consulta: " + query,
              waiterDevices);
          }).then(() => {
            this.notificationService.presentToast("Se envió su consulta correctamente", "success", "bottom");
          });
        });
      });
  }
}