import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Table } from 'src/app/classes/table';
import { TypeNotification } from 'src/app/classes/enums/typeNotification';
import { Status } from 'src/app/classes/enums/status';
import { Collections } from 'src/app/classes/enums/collections';
import { Profiles } from 'src/app/classes/enums/profiles';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { isNullOrUndefined } from 'util';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { FcmService } from 'src/app/services/FcmService';
import { DataService } from 'src/app/services/data.service';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss'],
})
export class ClientHomeComponent implements OnInit {

  currentUser: User;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private userService: UserService,
    private tableService: TableService,
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

  scanQr(callback) {
    if(this.qrscannerService.device == "mobile"){
      this.qrscannerService.scanQr().then(response => {
        if (response == Collections.WaitList) {
          this.addToWaitList();
        }
      });
    }
    else{
      this.addToWaitList();
    }
  }

  scanTableQR(){
    if(this.qrscannerService.device == "mobile"){
      this.qrscannerService.scanQr().then(tableId => {
        this.assignTableToUser(tableId, this.currentUser.id);
      });
    }
    else{
      this.assignTableToUser("uOqKTtmz8nbCEGsXT5CB", this.currentUser.id);
    }
  }

  addToWaitList(){
    this.userService.setDocument(Collections.WaitList, this.currentUser.id.toString(), { 'id': this.currentUser.id, 'date' : Date.now(), 'name': this.currentUser.name + " " + this.currentUser.surname, 'dni' : this.currentUser.dni });
    this.dataService.setStatus(Collections.Users, this.currentUser.id, Status.OnHold).then(() => {
      this.notificationService.presentToast("Agregado a lista de espera", TypeNotification.Warning, "top", false);
      this.userService.getUserById(this.currentUser.id.toString()).then(user => {
        this.currentUser = Object.assign(new User, user.data());
      });
      this.fcmService.getTokensByProfile(Profiles.Waiter).then(waiterDevices => {
        this.fcmService.sendNotification(
          "Nuevo cliente en lista de espera",
          "El cliente " + this.currentUser.name + " " + this.currentUser.surname + " está esperando a ser atendido",
          waiterDevices,
          "lista-de-espera");
      })
    })
  }

  removeFromWaitList() {
    this.dataService.deleteDocument(Collections.WaitList, this.currentUser.id.toString());
    this.dataService.setStatus(Collections.Users, this.currentUser.id, Status.Unattended).then(() => {
      this.notificationService.presentToast("Eliminado de la Lista de Espera", TypeNotification.Warning, "top", false);
      this.currentUser.status = Status.Unattended;
    })
  }

  logout(){
    this.authService.logOut();
  }

  assignTableToUser(tableId, userId){
    this.tableService.getTableById(tableId).then(table => {
      let currentTable = Object.assign(new Table, table.data());
      if (currentTable.status != Status.Available) {
        this.notificationService.presentToast(`Mesa N.° ${currentTable.number} ${currentTable.status}`, "danger", "top", false);
      }
      else{
        this.dataService.setStatus(Collections.Tables, tableId, Status.Busy);
        this.dataService.setStatus(Collections.Users, userId, Status.Attended);
        this.dataService.deleteDocument(Collections.WaitList, userId);
        this.notificationService.presentToast(`Mesa N.° ${currentTable.number} asignada`, "danger", "top", false);
        /*this.fcmService.getTokensByProfile(Profiles.Client).then(clients => {
          this.fcmService.sendNotification("Su mesa ha sido asignada", "Se le ha asignado la mesa N.° " + currentTable.number, clients, "menu");
        });*/
      }
    });
  }

}
