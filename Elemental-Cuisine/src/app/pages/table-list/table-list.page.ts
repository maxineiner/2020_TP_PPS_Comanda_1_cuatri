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
    this.tableService.getAllTables().subscribe(tables => {
      this.tables = tables.map(tableAux => {
          let table = tableAux.payload.doc.data() as Table
          table.id = tableAux.payload.doc.id;
          return table;
        });
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
