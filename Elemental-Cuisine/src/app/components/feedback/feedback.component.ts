import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {

  @Input() order: object;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  saveOrder(){
    this.orderService.saveOrder(this.authService.getCurrentUser().uid, this.order);
  }

}
