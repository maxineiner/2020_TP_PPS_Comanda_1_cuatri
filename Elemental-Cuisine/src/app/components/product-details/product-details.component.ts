import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from 'src/app/classes/product';
import { CameraService } from 'src/app/services/camera.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {

  @Input() public product: Product;
  private photos: string[];
  private quantity = 1;

  slideOpts = {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 15,
  };

  constructor(
    private modalCtrl: ModalController,
    private cameraService: CameraService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.getImages().then(() => {
      this.loadingService.closeLoading(undefined, undefined, undefined, 1000);
    })
  }

  async getImages(){
    if(this.product && this.product.photos.length > 0){
      this.photos = [];
      for(const photo of this.product.photos){
        await this.cameraService.getImageByName('productos', photo).then(url => {
          this.photos.push(url);
        })
      }
    }
  }

  increment () {
    this.quantity++;
  }
  
  decrement () {
    if(this.quantity > 1)
      this.quantity--;
  }

  dismiss(isClosed): void {
    if(isClosed){
      this.modalCtrl.dismiss();
    }
    else{
      this.modalCtrl.dismiss(this.quantity);
    }
  }
}
