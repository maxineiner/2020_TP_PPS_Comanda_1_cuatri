import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Profiles } from 'src/app/classes/enums/profiles';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  private total: number;
  private showOrder = false;
  private disableMenu = true;
  private currentUser: User;
  Profiles = Profiles;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    public menuCtrl: MenuController,
    private userService: UserService
  ) { 
    this.total = 0;
    this.authService.isUserLoggedIn().subscribe(user => {
      this.menuCtrl.enable(false);
      if (user && user.uid) {
        this.userService.getUserById(user.uid).then(user => {
          this.currentUser = user.data() as User
        })
        this.menuCtrl.enable(true);
        this.orderService.getOrder(user.uid).subscribe(orders => {
          if(!orders) {
            this.showOrder = false;
            return;
          }
          
          this.showOrder = this.currentUser.profile === Profiles.Client
          const reducer = (accumulator, order) => accumulator + order.total;
          this.total = Object.values(orders).reduce(reducer, 0);
        })
      }
    })
  }

  ngOnInit() {}

  logout(){
    this.authService.logOut();
  }
}
