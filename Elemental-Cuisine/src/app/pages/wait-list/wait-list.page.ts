import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TableService } from 'src/app/services/table.service';
import { Table } from 'src/app/classes/table';

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
    private tableService: TableService
  ) { }

  ngOnInit() {
    this.userService.getAllUsers('listaDeEspera').subscribe(clients => {
      this.users = clients.map(client => client.payload.doc.data() as any)
                          .filter(client => new Date(client.date).getDay() == new Date().getDay())
                          .sort((a:any,b:any) => (a.date > b.date) ? -1 : 1);
    });
  }

  takeOrder(){
    this.qrscannerService.scanQr().then(response => {
      this.tableService.getTableById(response).then(table => {
        let currentTable = Object.assign(new Table, table.data());
        if (currentTable.isBusy) {
          this.notificationService.presentToast("Mesa Ocupada", "danger", "top", false);
        }
        else{

        }
      });
    });
  }

}
