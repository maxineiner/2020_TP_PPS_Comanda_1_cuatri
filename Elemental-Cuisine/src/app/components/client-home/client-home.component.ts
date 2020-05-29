import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { TypeNotification } from 'src/app/classes/enums/TypeNotification';
import { Status } from 'src/app/classes/enums/Status';
import { Collections } from 'src/app/classes/enums/Collections';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { isNullOrUndefined } from 'util';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { FcmService } from 'src/app/services/FcmService';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss'],
})
export class ClientHomeComponent implements OnInit {

  currentUser: User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private qrscannerService: QrscannerService,
    private notificationService: NotificationService,
    private router: Router,
    private fcmService: FcmService
  ) {
      let user = this.authService.getCurrentUser();
      if (isNullOrUndefined(user)) {
        this.router.navigateByUrl("/login");
      }
      this.userService.getUserById(user.uid).then(userData => {
        this.currentUser = Object.assign(new User, userData.data());
      })
  }

  ngOnInit(){}

  addToWaitList() {
    this.qrscannerService.scanQr().then(response => {
      if (response == Collections.WaitingList) {
        this.userService.setDocument(Collections.WaitingList, this.currentUser.id.toString(), { 'date' : Date.now(), 'name': this.currentUser.name + " " + this.currentUser.surname, 'dni' : this.currentUser.dni });
        this.userService.update(Collections.Users, this.currentUser.id, { 'status': Status.OnHold }).then(() => {
          this.notificationService.presentToast("Agregado a lista de espera", TypeNotification.Warning, "top", false);
          this.userService.getUserById(this.currentUser.id.toString()).then(user => {
            this.currentUser = Object.assign(new User, user.data());
          });
          //this.fcmService.getTokensByProfile("mozo");
          this.fcmService.sendNotification(
            "Nuevo cliente en lista de espera",
            "El cliente " + this.currentUser.name + " " + this.currentUser.surname + " está esperando a ser atendido",
            "lista-de-espera",
            "emQWw_RbSMY:APA91bG3e6Kv3i08PZoP2cRFSp4xbjBPrNfmt6I6qA44ePezcfblBA4yCBkhGN787illbpVzIW5xDUgZuRL5X4crwdTqni7222PcH87R3h0miLaXj6dqijOwAAT94oEk9mIdHYzTTgmI");
        })
      }
    });
  }

  removeFromWaitList() {
    this.userService.deleteDocument(Collections.WaitingList, this.currentUser.id.toString());
    this.userService.update(Collections.Users, this.currentUser.id, { 'status': Status.Unattended }).then(() => {
      this.notificationService.presentToast("Eliminado de la Lista de Espera", TypeNotification.Warning, "top", false);
      this.currentUser.status = Status.Unattended;
    })
  }

  logout(){
    this.authService.logOut();
  }

}
