import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(
    private dataService: DataService
  ) { }

  saveTable(table){
    return this.dataService.add('mesas', table);
  }

  getAllTables(collection){
    return this.dataService.getAll(collection);
  }

  deleteTable(tableId){
    this.dataService.deleteDocument('mesas', tableId);
  }

  getTableById(tableId){
    return this.dataService.getOne('mesas', tableId);
  }
}
