import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Profiles } from 'src/app/classes/enums/profiles';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  private total: number;
  private showOrder = false;
  private disableMenu = true;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router
  ) { 
    this.total = 0;
    this.authService.isUserLoggedIn().subscribe(user => {
      if (user && user.uid) {
        this.userService.getUserById(user.uid).then(user => {
          this.showOrder = (user.data() as User).profile === Profiles.Client
        })
        this.disableMenu = false;
        this.orderService.getOrder(user.uid).subscribe(orders => {
          if(!orders.exists) return;
    
          const reducer = (accumulator, order) => accumulator + order.total;
          this.total = Object.values(orders.data()).reduce(reducer, this.total);
        })
      }
    })
  }

  ngOnInit() {}

  logout(){
    this.authService.logOut();
  }
}
