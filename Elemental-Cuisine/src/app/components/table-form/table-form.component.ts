import { Component, OnInit } from '@angular/core';
import { Table } from 'src/app/classes/table';
import { CameraService } from 'src/app/services/camera.service';
import { TableService } from 'src/app/services/table.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.scss'],
})
export class TableFormComponent implements OnInit {

  private table:Table;

  constructor(
    private cameraService: CameraService,
    private tableService: TableService,
    private qrscannerService: QrscannerService,
    private notificationService: NotificationService,
    private router: Router
  ) { 
    this.table = new Table();
  }

  ngOnInit() {}

  register(){ 
    this.tableService.saveTable(this.table).then(() => {
      this.notificationService.presentToast("Mesa creada", "success", "bottom", false);
      this.router.navigateByUrl('/listado/mesas');
    });
  }  

  takePhoto(){
    //Cambiar nombre de la foto (segundo parametro)
    this.cameraService.takePhoto('mesas', Date.now());
  }

  scan(){
    let data = this.qrscannerService.scanDni();
    alert(data);
  }

}
