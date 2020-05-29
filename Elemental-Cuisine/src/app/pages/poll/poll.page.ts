import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.page.html',
  styleUrls: ['./poll.page.scss'],
})
export class PollPage implements OnInit {
  currentUser: User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {  let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      this.router.navigateByUrl("/login");
    }
    this.userService.getUserById(user.uid).then(userData => {
      this.currentUser = Object.assign(new User, userData.data());
    })
  }

  ngOnInit() {
  }

}
