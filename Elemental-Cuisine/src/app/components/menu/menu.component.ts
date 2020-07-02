import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/classes/product';
import { AlertController, ModalController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { Status } from 'src/app/classes/enums/Status';
import { Order } from 'src/app/classes/order';
import { LoadingService } from 'src/app/services/loading.service';
import { Profiles } from 'src/app/classes/enums/profiles';
import { Categories } from 'src/app/classes/enums/categories';
import { ProductDetailsComponent } from '../product-details/product-details.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  private products: Array<Product>;
  private foods: Array<Product>;
  private drinks: Array<Product>;
  private desserts: Array<Product>;
  private order = new Order();
  @Output() sendOrder: EventEmitter<Order> = new EventEmitter<Order>();

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private cameraService: CameraService,
    private loadingService: LoadingService,
    public modalController: ModalController
  ) {
    this.foods = new Array<Product>();
    this.drinks = new Array<Product>();
    this.desserts = new Array<Product>();

    this.productService.getAllProducts().subscribe(products => {
      this.products = products.map(productAux => {
        let product = productAux.payload.doc.data() as Product;
        product.id = productAux.payload.doc.id;
        return product;
      });

      this.foods = this.products.filter(x => x.category == Categories.Food);
      this.drinks = this.products.filter(x => x.category == Categories.Drink);
      this.desserts = this.products.filter(x => x.category == Categories.Dessert);
    });
  }

  ngOnInit() {
  }

  async showDetails(product: Product): Promise<void> {
    this.loadingService.showLoading();
    const detailsModal = await this.modalController.create({
      component: ProductDetailsComponent,
      componentProps: { product: product}
    });
    detailsModal.onDidDismiss().then((response) => {
      var quantity = (response.data) ? parseInt(response.data) : null;
      if (quantity) {
        this.order.menu.push({ ...product, quantity: quantity });
        this.order.total += product.price * quantity;

        if (product.managerProfile == Profiles.Chef)
          this.order.statusFood = Status.PendingConfirm;
        if (product.managerProfile == Profiles.Bartender)
          this.order.statusDrink = Status.PendingConfirm;
      }
    });
    return await detailsModal.present();
  }

  sendMenu() {
    this.sendOrder.emit(this.order);
  }

}