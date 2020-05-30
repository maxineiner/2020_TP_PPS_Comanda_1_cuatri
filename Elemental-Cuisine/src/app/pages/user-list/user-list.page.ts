import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Collections } from 'src/app/classes/enums/collections';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {

  users:Array<User>;

  constructor(
    private userService: UserService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.userService.getAllUsers(Collections.Users).subscribe(users => {
      this.users = users.map(user => user.payload.doc.data() as User)
                        .filter(user => user.profile && user.profile != "cliente");
    });
  }

  modifyEmployee(user){

  }

  deleteEmployee(user){
    this.dataService.deleteDocument(Collections.Users , user);
  }
}
