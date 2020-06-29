import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/classes/product';
import { CameraService } from 'src/app/services/camera.service';
import { ProductService } from 'src/app/services/product.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { Categories } from 'src/app/classes/enums/categories';
import { Profiles } from 'src/app/classes/enums/profiles';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {

  Profiles = Profiles;
  @Input() idObject: string = "";
  private profile: Profiles;
  private product: Product;
  private images: Array<any>;
  private modification: boolean;
  private form: FormGroup;

  constructor(
    private cameraService: CameraService,
    private authService: AuthService,
    private userService: UserService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
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
        this.form.patchValue({
          name: this.product.name,
          description: this.product.description,
          preparationTime: this.product.preparationTime,
          price: this.product.price,
          category: this.product.category
        });

        this.product.photos.forEach(photo => {
          this.loadPhoto(photo);
        })
      });
    }

    this.form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z]+(\s{0,1}[a-zA-Z ])*$')
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required
      ])),
      preparationTime: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ])),
      price: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ])),
      category: new FormControl('')
    });

    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      this.router.navigateByUrl("/login");
    }
    this.userService.getUserById(user.uid).then(userData => {
      let currentUser = Object.assign(new User, userData.data());
      this.profile = currentUser.profile;

      if (this.profile != Profiles.Bartender) {
        this.form.controls["category"].setValidators([Validators.required]);
      }
      else {
        this.form.controls['category'].setValue(Categories.Drink);
      }
    });
  }

  validation_messages = {
    'name': [
      { type: 'required', message: 'El nombre es requerido.' },
      { type: 'pattern', message: 'Ingrese un nombre válido.' }
    ],
    'description': [
      { type: 'required', message: 'La descripción es requerida.' }
    ],
    'preparationTime': [
      { type: 'required', message: 'El tiempo de preparación es requerido.' },
      { type: 'pattern', message: 'Ingrese un tiempo de preparación válido.' }
    ],
    'price': [
      { type: 'required', message: 'El precio es requerido.' },
      { type: 'pattern', message: 'Ingrese un precio válido.' }
    ],
    'category': [
      { type: 'required', message: 'La categoría es requerida.' }
    ]
  };

  register(formValues) {
    this.formValuesToProduct(formValues);

    this.product.managerProfile = this.product.category == Categories.Drink ? Profiles.Bartender : Profiles.Chef;
    this.product.photos = this.images.map(x => x.name);

    if (this.modification) {
      this.productService.modifyProduct(this.idObject, this.product).then(() => {
        this.notificationService.presentToast("Producto modificado", "success", "middle");
        if (this.profile == Profiles.Owner) {
          this.router.navigateByUrl('/listado/productos');
        } else {
          this.router.navigateByUrl('/productos');
        }
      });
    }
    else {
      this.productService.saveProduct(this.product).then(product => {
        this.notificationService.presentToast("Producto creado", "success", "middle");
        if (this.profile == Profiles.Owner) {
          this.router.navigateByUrl('/listado/productos');
        } else {
          this.router.navigateByUrl('/productos');
        }
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

  formValuesToProduct(formValues) {
    this.product.name = formValues.name;
    this.product.description = formValues.description;
    this.product.preparationTime = formValues.preparationTime;
    this.product.price = formValues.price;

    if (this.profile == Profiles.Bartender) {
      this.product.category = Categories.Drink;
    }
    else {
      this.product.category = formValues.category;
    }
  }
}
