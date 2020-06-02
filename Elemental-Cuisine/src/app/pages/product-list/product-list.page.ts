import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/classes/product';
//import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  private products: Array<Product>;

  constructor(
    private productService: ProductService,
    //public popoverController: PopoverController
  ) { 
    this.productService.getAllProducts('productos').subscribe(products => {
      this.products = products.map(product => product.payload.doc.data() as Product);
    });
  }

  ngOnInit() {
  }

  deleteProduct(event, productId){
    event.stopPropagation();
    this.productService.deleteProduct(productId);
  }

  modifyProduct(event){
    event.stopPropagation();
  }

  showDetails(product){
    console.log(product);
  }
}
