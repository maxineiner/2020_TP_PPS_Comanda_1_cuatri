import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/classes/product';
import { Router } from '@angular/router';
import { Profiles } from 'src/app/classes/enums/profiles';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined } from 'util';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Categories } from 'src/app/classes/enums/categories';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  private products: Array<Product>;
  private profile: Profiles;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      this.router.navigateByUrl("/login");
    }
    this.userService.getUserById(user.uid).then(userData => {
      let currentUser = Object.assign(new User, userData.data());
      this.profile = currentUser.profile;
    });

    this.productService.getAllProducts().subscribe(products => {
      this.products = products.map(productAux => {
        let product = productAux.payload.doc.data() as Product;
        product.id = productAux.payload.doc.id;
        return product;
      });
      if (this.profile == Profiles.Bartender) {
        this.products = this.products.filter(x => x.category == Categories.Drink);
      }
      else if (this.profile == Profiles.Chef) {
        this.products = this.products.filter(x => x.category != Categories.Drink);
      }
    });
  }

  ngOnInit() {
  }

  deleteProduct(event, productId) {
    event.stopPropagation();
    this.productService.deleteProduct(productId);
  }

  modifyProduct(event) {
    event.stopPropagation();
  }

  showDetails(product) {
    console.log(product);
  }

  routerToLink() {
    this.router.navigateByUrl("/registro/producto");
  }
}
