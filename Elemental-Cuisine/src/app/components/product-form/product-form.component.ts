import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/classes/product';
import { CameraService } from 'src/app/services/camera.service';
import { ProductService } from 'src/app/services/product.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';

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
        this.notificationService.presentToast("Producto modificado", "success", "middle");
        this.router.navigateByUrl('/listado/productos');
      });
    }
    else {
      this.productService.saveProduct(this.product).then(product => {
        this.notificationService.presentToast("Producto creado", "success", "middle");
        this.router.navigateByUrl('/listado/productos');
      });
    }
  }

  async takePhoto() {
    if (this.images.length < 3) {
      let imgName = `${this.product.name}-${Date.now()}`;
      await this.cameraService.takePhoto('productos', imgName);
      this.loadPhoto(imgName);
    }
    else {
      this.notificationService.presentToast("Solo se pueden subir 3 fotos.", "danger", "middle");
    }
  }

  deletePhoto(imgName) {
    this.cameraService.deleteImage('productos', imgName).then(
      resp => {
        this.images = this.images.filter(x => x.name != imgName);
      },
      err => {
        this.notificationService.presentToast("Error al eliminar la foto.", "danger", "bottom");
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
