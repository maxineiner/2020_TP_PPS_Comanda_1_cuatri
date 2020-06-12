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

  users: Array<Object>;

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

//TODO
  removeClient(user: User){

  }
}
