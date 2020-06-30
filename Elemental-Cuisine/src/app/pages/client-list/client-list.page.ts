import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from './../../services/email.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { Collections } from 'src/app/classes/enums/collections';
import { Status } from 'src/app/classes/enums/Status';
import { NotificationService } from 'src/app/services/notification.service';
import { TypeNotification } from 'src/app/classes/enums/typeNotification';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.page.html',
  styleUrls: ['./client-list.page.scss'],
})
export class ClientListPage implements OnInit {

  showSearchBar = false;
  pendingClients: Array<User>;
  aprobatedClients: Array<User>;
  searchBarTargetText: string;

  users:Array<User>;

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private emailService: EmailService

  ) { }

  ngOnInit() {
    this.userService.getAllUsers(Collections.Users).subscribe(users => {
      this.pendingClients = users.map(user => user.payload.doc.data() as User)
                        .filter(user => user.profile && user.profile == "cliente" && user.status == Status.PendingApproval);
    });

    this.userService.getAllUsers(Collections.Users).subscribe(users => {
      this.aprobatedClients = users.map(user => user.payload.doc.data() as User)
                        .filter(user => user.profile && user.profile == "cliente" && user.status != Status.PendingApproval);
    });

  }

  deleteClient(user: User) {
    event.stopPropagation();
    this.userService.deleteUser(user.id);
  }

  approveClient(user)
  {
    this.dataService.setStatus(Collections.Users, user.id, Status.Unattended).then(() => {
      this.emailService.sendAprovalEmail(user.email)
        this.notificationService.presentToast("Cliente aprobado! Se ha enviado el correo electrónico", TypeNotification.Success, "bottom", false);
      });
  }

  search(event) 
  {
    this.searchBarTargetText = event.detail.value;
  }
  
}
