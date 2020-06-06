import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Collections } from '../classes/enums/collections';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderCollection = Collections.Orders;

  constructor(
    private dataService: DataService
  ) { }

  saveOrder(id, order){
    console.log(this.orderCollection)
    return this.dataService.setData(this.orderCollection, id, order);
  }

  getAllOrders(){
    return this.dataService.getAll(this.orderCollection);
  }

  updateOrder(id, order){
    this.dataService.update(this.orderCollection, id, order);
  }

  getOrderById(id){
    return this.dataService.getOne(this.orderCollection, id);
  }
}
