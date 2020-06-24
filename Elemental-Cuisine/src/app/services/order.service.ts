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
    return this.dataService.setData(this.orderCollection, order, id);
  }

  getAllOrders(){
    return this.dataService.getAll(this.orderCollection);
  }

  //Retorna una promesa
  getOrderById(id){
    return this.dataService.getOne(this.orderCollection, id);
  }

  modifyOrder(id, order) {
    return this.dataService.update(this.orderCollection, id, order);
  }

  deleteOrder(id){
    this.dataService.deleteDocument(this.orderCollection, id);
  }
  
  //Retorna una observer
  getOrder(id){
    return this.dataService.get(this.orderCollection, id);
  }

}
