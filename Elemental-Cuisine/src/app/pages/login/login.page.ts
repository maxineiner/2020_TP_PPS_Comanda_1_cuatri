import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Profiles } from 'src/app/classes/enums/profiles';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private email: string;
  private password: string;
  private photoName: string = "";
  form: FormGroup;
  defaultUsers: Array<any> = [];
  user: User;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService,
    private alertController: AlertController,
    private cameraService: CameraService,
    private notificationService: NotificationService,
    private fb: Facebook,
    private googlePlus: GooglePlus
  ) { }

  ngOnInit() {
    this.addDefaultUser();
    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  ionViewWillEnter(){
    delete this.user;
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'El email es requerido.' },
      { type: 'pattern', message: 'Ingrese un email válido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La password debe contener al menos 6 catacteres.' }
    ]
  };

  addDefaultUser() {
    this.defaultUsers.push({ "email": "admin@admin.com", "password": "123456" });
    this.defaultUsers.push({ "email": "cliente@cliente.com", "password": "123456" });
    this.defaultUsers.push({ "email": "mozo@mozo.com", "password": "123456" });
    this.defaultUsers.push({ "email": "maitre@maitre.com", "password": "123456" });
    this.defaultUsers.push({ "email": "bartender@bartender.com", "password": "123456" });
    this.defaultUsers.push({ "email": "cocinero@cocinero.com", "password": "123456" });
    // this.defaultUsers.push({ "email": "anonimo@anonimo.com", "password": "123456" });
  }

  setDefaultUser() {
    if(this.user){
      this.onSubmitLogin(this.user);
    }
  }

  onSubmitLogin(form) {
    this.loadingService.showLoading();
    this.authService.logIn(form.email, form.password)
      .then(res => {

        // Verificamos si está aprobado
        this.userService.getUserById(this.authService.getCurrentUser().uid).then(user => {
          if (user.data().profile === 'cliente' && user.data().status === 'pendienteAprobacion') {
            this.authService.logOut();
            this.loadingService.closeLoading("Atención", "Su cuenta aún no fue aprobada. Aguarde un momento por favor e intente nuevamente. Gracias", 'info');
          } else {
            this.loadingService.closeLoadingAndRedirect("/inicio");
          }
        });
      })
      .catch(err => {
        this.loadingService.closeLoading("Error", "Verifique usuario y contraseña", 'error');
      });
  }

  async anonymousLogin(event) {
    event.stopPropagation();
    var photoName = "";

    const alert = await this.alertController.create({
      header: 'Ingresar como Anónimo',
      message: 'Al ingresar como anónimo, muchas funcionalidades no estarán disponibles.',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de Usuario',
        }
      ],
      buttons: [
        {
          text: 'Sacar Foto',
          handler: (inputs) => {
            this.takePhoto(inputs.name);
            return false;
          }
        },
        {
          text: 'Registrar',
          handler: (inputs) => {
            this.registerAnonymous(inputs.name)
            return false;
          }
        }
      ]
    });
    alert.present();
    return alert.onDidDismiss().then(() => {
      this.photoName = "";
    })
  }

  googleLogin() {
    this.googlePlus.login({
      'webClientId': '898640537441-vtvt4594qrkhnv6a8isvp2nmfko1m96m.apps.googleusercontent.com',
      'offline': true
    })
    .then(googleResponse => {
      const credential = this.authService.getGoogleCredentials(googleResponse);
      this.authService.logInWithCredential(credential).then(() => {
        const currentUser = this.authService.getCurrentUser();
        this.userService.getUserById(currentUser.uid).then(user => {
          if (!user.exists) {
            var newUser: User = {
              id: currentUser.uid,
              email: currentUser.email,
              password: null,
              profile: Profiles.Client,
              name: currentUser.displayName.split(" ")[0],
              surname: currentUser.displayName.split(" ")[1],
              photo: currentUser.photoURL,
              status: "sinAtender",
              dni: null,
              cuil: null
            }
            this.userService.saveUser(newUser);
          }
          this.router.navigateByUrl('/inicio');
        })
      })
    })
    .catch(err => console.error(err));
  }

  facebookLogin() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((facebookResponse: FacebookLoginResponse) => {
        if (facebookResponse.status === 'connected') {
          const credential = this.authService.getFacebookCredentials(facebookResponse);
          this.authService.logInWithCredential(credential).then(() => {
            const currentUser = this.authService.getCurrentUser();
            this.userService.getUserById(currentUser.uid).then(user => {
              if (!user.exists) {
                var newUser: User = {
                  id: currentUser.uid,
                  email: currentUser.email,
                  password: null,
                  profile: Profiles.Client,
                  name: currentUser.displayName.split(" ")[0],
                  surname: currentUser.displayName.split(" ")[1],
                  photo: currentUser.photoURL,
                  status: "sinAtender",
                  dni: null,
                  cuil: null
                }
                this.userService.saveUser(newUser);
              }
              this.router.navigateByUrl('/inicio');
            });
          });
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  async takePhoto(name) {
    if (name != "") {
      name = `${name}-${Date.now()}`;
      this.loadingService.showLoading();
      await this.cameraService.takePhoto('usuarios', name).then(() => {
        this.loadingService.closeLoading();
        this.photoName = name;
      });
    }
    else {
      this.notificationService.presentToast("Primero ingrese el nombre.", "danger", "bottom");
    }
  }

  registerAnonymous(name) {
    if (this.photoName != "" && name != "") {
      var random = Math.floor(Math.random() * (999 - 1)) + 1;
      var newUser: User = {
        id: "",
        email: name + "-" + random + "@anonymous.com",
        password: "123456",
        profile: Profiles.Client,
        name: name,
        surname: "(anónimo)",
        photo: this.photoName,
        status: "sinAtender",
        dni: null,
        cuil: null,
        anonymous: true
      }

      this.userService.saveUserWithLogin(newUser).then(() => {
        this.alertController.dismiss();
        this.router.navigateByUrl('/inicio');
      });
    }
    else {
      this.notificationService.presentToast("Falta ingresar nombre o sacar la foto.", "danger", "bottom", false);
    }
  }
}
