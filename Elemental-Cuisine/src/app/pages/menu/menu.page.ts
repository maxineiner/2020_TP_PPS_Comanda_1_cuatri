import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/classes/product';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  private products: Array<Product>;

  constructor(
    private productService: ProductService,
  ) { 
    this.productService.getAllProducts('productos').subscribe(products => {
      this.products = products.map(product => product.payload.doc.data() as Product);
    });
  }


  ngOnInit() {
  }

}