import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/classes/product';
import { Collections } from 'src/app/classes/enums/collections';
import { AlertController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  private products: Array<Product>;
  private total: number = 0;
  private menu: Array<Product> = new Array<Product>();
  @Output() sendOrder: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private cameraService: CameraService
  ) { 
    this.productService.getAllProducts().subscribe(products => {
      this.products = products.map(product => product.payload.doc.data() as Product);
    });
  }


  ngOnInit() {
  }

  showDetails(product: Product){
    this.showAlert(product).then(response => {
      var quantity = (response.data) ? response.data.quantity : "";
      if(quantity){
        for(let i = 0; i < quantity; i++){
          this.menu.push(product);
        }
        let reducer = ( accumulator, currentProduct ) => accumulator + currentProduct.price;

        this.total = this.menu.reduce(reducer, 0)
      }
    });
  }

  async showAlert(product: Product) {
    let message = "<div>" +
                    `<span>${product.description}</span>`;
    message += (product.photos.length > 0) ? `<img src="${await this.cameraService.getImageByName('productos', product.photos[0])}" style="bmenu-radius: 2px">` : "" + "</div>"

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
          text: 'Agregar al pedido',
          handler: (input) => {
            alert.dismiss(input);
            return false;
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            alert.dismiss(false);
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

  sendMenu(){
    this.sendOrder.emit({"menu":this.menu, "price": this.total});
  }

}