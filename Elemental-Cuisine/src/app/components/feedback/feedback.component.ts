import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {

  @Input() order: object;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {}

  saveOrder(){
    this.orderService.saveOrder(this.authService.getCurrentUser().uid, this.order);
    this.notificationService.presentToast("Pedido realizado con éxito", "success", "top");
    this.router.navigateByUrl("/inicio")
  }

}
