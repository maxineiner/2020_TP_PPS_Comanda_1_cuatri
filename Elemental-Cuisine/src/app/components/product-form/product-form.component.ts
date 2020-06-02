import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/classes/product';
import { CameraService } from 'src/app/services/camera.service';
import { ProductService } from 'src/app/services/product.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Collections } from 'src/app/classes/enums/collections';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {

  @Input() idObject: string = "";
  private product: Product;
  private images: Array<any>;
  private modification: boolean;

  constructor(
    private cameraService: CameraService,
    private productService: ProductService,
    private qrscannerService: QrscannerService,
    private notificationService: NotificationService,
    private dataService: DataService,
    private router: Router
  ) {
    this.images = new Array<object>();
    this.product = new Product();
    this.modification = false;
  }

  ngOnInit() {
    if (this.idObject) {
      this.modification = true;
      this.productService.getProduct(this.idObject).then(prod => {
        this.product = prod.data() as Product;
        this.product.photos.forEach(photo => {
          this.loadPhoto(photo);
        })
      });
    }
  }

  register() {
    this.product.photos = this.images.map(x => x.name);
    if (this.modification) {
      this.productService.modifyProduct(this.idObject, this.product).then(() => {
        this.notificationService.presentToast("Producto modificado", "success", "bottom", false);
        this.router.navigateByUrl('/listado/productos');
      });
    }
    else {
      this.productService.saveProduct(this.product).then(product => {
        this.dataService.setId(Collections.Products, product.id)
        this.notificationService.presentToast("Producto creado", "success", "bottom", false);
        this.router.navigateByUrl('/listado/productos');
      });
    }
  }

  async takePhoto() {
    if (this.images.length < 3) {
      let imgName = `${this.product.name}-${Date.now()}`;
      this.loadPhoto(imgName);
    }
    else {
      this.notificationService.presentToast("Solo se pueden subir 3 fotos.", "danger", "bottom", false);
    }
  }

  deletePhoto(imgName) {
    this.cameraService.deleteImage('productos', imgName).then(
      resp => {
        this.images = this.images.filter(x => x.name != imgName);
      },
      err => {
        this.notificationService.presentToast("Error al eliminar la foto.", "danger", "bottom", false);
      })
  }

  async loadPhoto(imgName) {
    let imgUrl = await this.cameraService.getImageByName('productos', imgName);
    this.images.push({ "url": imgUrl, "name": imgName });
  }

  scan() {
    let data = this.qrscannerService.scanDni();
    alert(data);
  }
}
