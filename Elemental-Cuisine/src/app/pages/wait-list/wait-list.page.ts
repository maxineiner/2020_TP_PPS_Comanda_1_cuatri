import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Collections } from 'src/app/classes/enums/collections';
import { Status } from 'src/app/classes/enums/Status';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/classes/user';
import { FcmService } from 'src/app/services/fcmService';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-wait-list',
  templateUrl: './wait-list.page.html',
  styleUrls: ['./wait-list.page.scss'],
})
export class WaitListPage implements OnInit {

  users: Array<Object>;

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private fcmService: FcmService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.userService.getAllUsers(Collections.WaitList).subscribe(clients => {
      this.users = clients.map(client => client.payload.doc.data() as any)
                          .filter(client => new Date(client.date).getDay() == new Date().getDay())
                          .sort((a:any,b:any) => (a.date > b.date) ? -1 : 1);
    });
  }

  removeClient(user: User){
    this.dataService.deleteDocument(Collections.WaitList,user.id);
    this.dataService.setStatus(Collections.Users, user.id, Status.CanTakeTable).then(() => {
      this.fcmService.getTokensById(user.id).then(userDevice => {
        this.fcmService.sendNotification(
          "Ya puede escanear su mesa",
          "El metre lo ha habilitado para escanear su mesa",
          [userDevice]
        )
      })
    });
    this.notificationService.presentToast("El usuario ya puede escanear una mesa", "success", "middle");
  }
}
