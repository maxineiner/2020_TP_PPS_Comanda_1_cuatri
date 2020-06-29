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

  slideOpts = {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 15
  };

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

  showDetails(product: Product) {
    this.loadingService.showLoading();
    this.createAlert(product).then(response => {
      var quantity = (response.data) ? parseInt(response.data.quantity) : null;
      if (quantity) {
        this.order.menu.push({ ...product, quantity: quantity });
        this.order.total += product.price * quantity;
        if (product.managerProfile == Profiles.Chef)
          this.order.statusFood = Status.PendingConfirm;
        if (product.managerProfile == Profiles.Bartender)
          this.order.statusDrink = Status.PendingConfirm;
      }
    });
    if (product.managerProfile == Profiles.Chef)
      this.order.statusFood = Status.PendingConfirm;
    if (product.managerProfile == Profiles.Bartender)
      this.order.statusDrink = Status.PendingConfirm;

  }

  createAlert(product: Product) {
    let message = "<div>" +
      `<ion-label>${product.description}</ion-label>`;
    let slides = '<ion-slides [options]="slideOpts">';
    const promise = new Promise(resolve => {
      product.photos.forEach(async (photo, index, array) => {
        await this.cameraService.getImageByName('productos', photo).then(url => {
          slides += '<ion-slide>' +
            `<img src="${url}" style="bmenu-radius: 2px">` +
            '</ion-slide>'
        })
        if (index === array.length - 1) resolve();
      })
    })

    return promise.then(() => {
      message += slides +
        '</ion-slides>' +
        "</div>";
      this.loadingService.closeLoading(undefined, undefined, undefined, 1000);
      return this.showAlert(product, message);
    })
  }

  async showAlert(product, message) {
    const alert = await this.alertController.create({
      header: product.name,
      subHeader: `$${product.price}`,
      message: message,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Cantidad de unidades'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'Agregar al pedido',
          handler: (input) => {
            alert.dismiss(input);
            return false;
          }
        }
      ]
    });
    alert.present();
    return alert.onDidDismiss().then((data) => {
      return data;
    })
  }

  sendMenu() {
    this.sendOrder.emit(this.order);
  }

}