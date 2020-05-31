import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TableService } from 'src/app/services/table.service';
import { Table } from 'src/app/classes/table';
import { Collections } from 'src/app/classes/enums/collections';
import { Status } from 'src/app/classes/enums/status';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/classes/user';
import { FcmService } from 'src/app/services/FcmService';
import { Profiles } from 'src/app/classes/enums/profiles';

@Component({
  selector: 'app-wait-list',
  templateUrl: './wait-list.page.html',
  styleUrls: ['./wait-list.page.scss'],
})
export class WaitListPage implements OnInit {

  users:Array<Object>;

  constructor(
    private userService: UserService,
    private qrscannerService: QrscannerService,
    private notificationService: NotificationService,
    private tableService: TableService,
    private dataService: DataService,
    private fcmService: FcmService
  ) { }

  ngOnInit() {
    this.userService.getAllUsers(Collections.WaitList).subscribe(clients => {
      this.users = clients.map(client => client.payload.doc.data() as any)
                          .filter(client => new Date(client.date).getDay() == new Date().getDay())
                          .sort((a:any,b:any) => (a.date > b.date) ? -1 : 1);
    });
  }

  scanQr(user: User){
    if(this.qrscannerService.device == "mobile"){
      this.qrscannerService.scanQr().then(tableId => {
        this.assignTableToUser(tableId, user.id);
      })
    }
    else{
      this.assignTableToUser("uOqKTtmz8nbCEGsXT5CB", user.id);
    }
  }

  assignTableToUser(tableId, userId){
    this.tableService.getTableById(tableId).then(table => {
      let currentTable = Object.assign(new Table, table.data());
      if (currentTable.status != Status.Available) {
        this.notificationService.presentToast("Mesa " + currentTable.status, "danger", "top", false);
      }
      else{
        this.dataService.setStatus(Collections.Tables, tableId, Status.Busy);
        this.dataService.setStatus(Collections.Users, userId, Status.Attended);
        this.dataService.deleteDocument(Collections.WaitList, userId);
        this.fcmService.getTokensByProfile(Profiles.Client).then(clients => {
          this.fcmService.sendNotification("Su mesa ha sido asignada", "Se le ha asignado la mesa N.° " + currentTable.number, clients, "menu");
        })
      }
    });
  }

}
