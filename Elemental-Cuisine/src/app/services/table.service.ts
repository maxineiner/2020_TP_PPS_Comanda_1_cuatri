import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Collections } from '../classes/enums/collections';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private tableCollection = Collections.Tables;

  constructor(
    private dataService: DataService
  ) { }

  saveTable(table){
    return this.dataService.add(this.tableCollection, table);
  }

  getAllTables(){
    return this.dataService.getAll(this.tableCollection);
  }

  deleteTable(tableId){
    this.dataService.deleteDocument(this.tableCollection, tableId);
  }

  modifyTable(tableId, table) {
    return this.dataService.update(this.tableCollection, tableId, table);
  }

  getTableById(tableId){
    return this.dataService.getOne(this.tableCollection, tableId);
  }
}
