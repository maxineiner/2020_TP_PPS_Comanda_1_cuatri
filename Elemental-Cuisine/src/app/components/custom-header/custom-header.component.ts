import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { TableService } from 'src/app/services/table.service';
import { FcmService } from 'src/app/services/fcmService';
import { NotificationService } from 'src/app/services/notification.service';
import { isNullOrUndefined } from 'util';
import { Profiles } from 'src/app/classes/enums/profiles';
import { Table } from 'src/app/classes/table';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { CurrentAttentionService } from 'src/app/services/currentAttention.service';
@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent implements OnInit {

  currentUser: User;

  @Input() color: string = "dark";

  @Input() title: string = "Default";
  @Input() titleColor: string;

  @Input() icon: string;
  @Input() iconColor: string;
  @Input() helpIconColor: string;

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private currentAttentionService: CurrentAttentionService,
    private tableService: TableService,
    private fcmService: FcmService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
    let user = this.authService.getCurrentUser();
    if (!isNullOrUndefined(user)) {
      this.userService.getUserById(user.uid).then(userData => {
        this.currentUser = Object.assign(new User, userData.data());
      });
    }
  }

  ngOnInit() { }

  async askWaiter() {
    const alert = await this.alertController.create({
      header: "Tenes alguna duda? Escribila acá!",
      message: "Se le notificará tu consulta al mozo y este acudirá cuanto antes para resolverla!",
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
    });
  }

  sendNotificationToWaiter(query) {
    this.currentAttentionService.getAttentionById(this.currentUser.id).then(response => {
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

  iconClicked() {
    this.onClick.emit();
  }
}
