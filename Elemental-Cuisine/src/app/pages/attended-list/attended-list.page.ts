import { Component, OnInit } from '@angular/core';
import { Collections } from 'src/app/classes/enums/collections';
import { Profiles } from 'src/app/classes/enums/profiles';
import { Status } from 'src/app/classes/enums/status';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-attended-list',
  templateUrl: './attended-list.page.html',
  styleUrls: ['./attended-list.page.scss'],
})
export class AttendedListPage implements OnInit {
  
  users:Array<Object>;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getAllUsers(Collections.Users).subscribe(users => {
      this.users = users.map(user => user.payload.doc.data() as User)
                        .filter(user => user.profile == Profiles.Client && user.status == Status.Attended)
    });
  }

}
