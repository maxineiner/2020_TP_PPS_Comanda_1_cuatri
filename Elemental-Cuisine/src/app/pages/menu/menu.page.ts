import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/classes/product';
import { Collections } from 'src/app/classes/enums/collections';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  private products: Array<Product>;

  constructor(
    private productService: ProductService,
    private alertController: AlertController
  ) { 
    this.productService.getAllProducts(Collections.Products).subscribe(products => {
      this.products = products.map(product => product.payload.doc.data() as Product);
    });
  }


  ngOnInit() {
  }

  showDetails(product){
    console.log(product);
    this.showAlert(product).then(response => {
      let quantity = response.data.quantity;
      if(quantity){
        console.log(quantity);
      }
    });
  }

  async showAlert(product:Product) {
    let message = "<div>" +
                    `<span>${product.description}</span>`;
    message += (product.photos.length > 0) ? `<img src="${product.photos[0]}" style="border-radius: 2px">` : "" + "</div>"

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

}