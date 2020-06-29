import { Profiles } from 'src/app/classes/enums/profiles';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { FcmService } from 'src/app/services/fcmService';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  currentUser: User;
  Profiles = Profiles;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fcmService: FcmService,
    public menuCtrl: MenuController
  ) {
      this.fcmService.getToken();
      let user = this.authService.getCurrentUser();
      if (isNullOrUndefined(user))  this.router.navigateByUrl("/login");

      this.menuCtrl.enable(true);
      this.userService.getUserById(user.uid).then(userData => {
        this.currentUser = Object.assign(new User, userData.data());
      });
  }

  showAlert() {
    // Swal.fire('Oops...', 'Something went wrong!', 'error');
    Swal.fire({
      title: 'Custom width, padding, background.',
      width: 600,
      padding: '3em',
      backdrop: false
    })
  }

}
