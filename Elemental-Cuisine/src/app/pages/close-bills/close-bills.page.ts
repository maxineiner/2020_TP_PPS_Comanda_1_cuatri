import { Component, OnInit } from '@angular/core';
import { CurrentAttentionService } from 'src/app/services/currentAttention.service';
import { Attention } from 'src/app/classes/attention';
import { TableService } from 'src/app/services/table.service';
import { Table } from 'src/app/classes/table';
import { OrderService } from 'src/app/services/order.service';
import { Status } from 'src/app/classes/enums/Status';
import { Collections } from 'src/app/classes/enums/collections';
import { DataService } from 'src/app/services/data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-close-bills',
  templateUrl: './close-bills.page.html',
  styleUrls: ['./close-bills.page.scss'],
})
export class CloseBillsPage implements OnInit {

  private attentions: Array<Attention>;
  private pendingBills: Array<any>;

  constructor(
    private dataService: DataService,
    private currentAttentionService: CurrentAttentionService,
    private tableService: TableService,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private router: Router
  ) {
      this.pendingBills = new Array<any>();
    }

  ngOnInit() {
    this.currentAttentionService.getAllAttentions().subscribe(attentions => {      
      this.attentions = attentions.map(attentionsAux => {
        let attention = attentionsAux.payload.doc.data() as Attention;
        attention.id = attentionsAux.payload.doc.id;
        return attention;
      });

      this.attentions.forEach(attention => {
        if (attention.billRequested) {
          this.tableService.getTableById(attention.tableId).then(resp => {
            let table = Object.assign(new Table, resp.data());
            this.pendingBills.push({ "id": attention.id, "tableId": attention.tableId, "tableNumber": "Mesa " + table.number })
          });
        }
      });
    });
  }

  closeBill(id) {
    let pendingBill = this.pendingBills.find(x => x.id == id);

    this.dataService.setStatus(Collections.Users, pendingBill.id, Status.Unattended);
    this.dataService.setStatus(Collections.Tables, pendingBill.tableId, Status.Available);

    this.orderService.deleteOrder(id);
    this.currentAttentionService.deleteAttention(id);

    this.pendingBills = this.pendingBills.filter(x => x.id != id);
  }
}