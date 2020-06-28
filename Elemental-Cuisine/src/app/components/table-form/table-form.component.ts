import { Component, OnInit, Input } from '@angular/core';
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

  @Input() idObject: string = "";
  private table: Table;
  private image: any;
  private modification: boolean;

  constructor(
    private cameraService: CameraService,
    private tableService: TableService,
    private qrscannerService: QrscannerService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.table = new Table();
  }

  ngOnInit() {
    if (this.idObject) {
      this.modification = true;
      this.tableService.getTableById(this.idObject).then(table => {
        this.table = table.data() as Table;
        if (this.table.photo)
          this.loadPhoto(this.table.photo);
      });
    }
  }

  register() {
    if (this.image) {
      this.table.photo = this.image.name;
    }
    else {
      this.table.photo = null;
    }
    if (this.modification) {
      this.tableService.modifyTable(this.idObject, this.table).then(() => {
        this.notificationService.presentToast("Mesa modificada", "success", "middle");
        this.router.navigateByUrl('/listado/mesas');
      });
    }
    else {
      this.tableService.saveTable(this.table).then(() => {
        this.notificationService.presentToast("Mesa creada", "success", "bottom", false);
        this.router.navigateByUrl('/listado/mesas');
      });
    }
  }

  async takePhoto() {
    if (!this.image) {
      let imgName = `${this.table.number}-${Date.now()}`;
      await this.cameraService.takePhoto('mesas', imgName);
      this.loadPhoto(imgName);
    }
    else {
      this.notificationService.presentToast("Solo se puede subir una foto.", "danger", "middle");
    }
  }

  deletePhoto(imgName) {
    debugger;
    this.cameraService.deleteImage('mesas', imgName).then(
      resp => {
        debugger;
        this.image = null;
      },
      err => {
        debugger;
        this.notificationService.presentToast("Error al eliminar la foto.", "danger", "bottom");
      })
  }

  scan() {
    let data = this.qrscannerService.scanDni();
    console.log(data);
  }

  async loadPhoto(imgName) {
    let imgUrl = await this.cameraService.getImageByName('mesas', imgName);
    this.image = { "url": imgUrl, "name": imgName };
  }
}
