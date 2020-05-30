import { Component, OnInit } from '@angular/core';
import { Table } from 'src/app/classes/table';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.page.html',
  styleUrls: ['./table-list.page.scss'],
})
export class TableListPage implements OnInit {

  private tables: Array<Table>;

  constructor(
    private tableService: TableService
  ) { 
    this.tableService.getAllTables('mesas').subscribe(tables => {
      this.tables = tables.map(table => table.payload.doc.data() as Table);
    });
  }

  ngOnInit() {
  }

  deleteTable(table){
    this.tableService.deleteTable(table.id);
  }

  modifyTable(table){
    
  }

}
