import { Status } from './../../classes/enums/Status';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { CameraService } from 'src/app/services/camera.service';
import { NotificationService } from 'src/app/services/notification.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { Profiles } from 'src/app/classes/enums/profiles';
import { FcmService } from 'src/app/services/fcmService';
import { TypeNotification } from 'src/app/classes/enums/typeNotification';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {

  @Input() isClient: boolean;
  @Input() idObject: string = "";
  private image: any;
  private user: User;
  private form: FormGroup;
  private modification: boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    private loadingService: LoadingService,
    private cameraService: CameraService,
    private qrscannerService: QrscannerService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private fcmService: FcmService
  ) {
    this.user = new User();
  }

  ngOnInit() {
    if (this.idObject) {
      this.modification = true;
      this.userService.getUserById(this.idObject).then(user => {
        this.loadingService.showLoading().then(() => {
          this.user = user.data() as User;
          this.form.patchValue({
            name: this.user.name,
            surname: this.user.surname,
            dni: this.user.dni,
            cuil: this.user.cuil,
            email: this.user.email,
            password: this.user.password,
            confirmPass: this.user.password,
            profile: this.user.profile
          });

          if (this.user.photo)
            this.loadPhoto(this.user.photo);
        }).then(() => {
          this.loadingService.closeLoading();
        });
      });
    }

    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      confirmPass: new FormControl(''),
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z\\s]+$')
      ])),
      surname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z\\s]+$')
      ])),
      dni: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{8}$'),
        Validators.required
      ])),
      cuil: new FormControl(''),
      profile: new FormControl('')
    });
    this.form.controls["confirmPass"].setValidators([this.checkPasswords(), Validators.required])
    if (!this.isClient) {
      this.form.controls["cuil"].setValidators([Validators.pattern('^[0-9]{11}$'), Validators.required])
      this.form.controls["profile"].setValidators([Validators.required])
    }
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'El correo electrónico es requerido.' },
      { type: 'pattern', message: 'Ingrese un correo electrónico válido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La password debe contener al menos 6 catacteres.' }
    ],
    'confirmPass': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'passwordError', message: 'Las contraseñas ingresadas no coinciden' }
    ],
    'name': [
      { type: 'required', message: 'El nombre es requerido.' },
      { type: 'pattern', message: 'Ingrese un nombre válido.' }
    ],
    'surname': [
      { type: 'required', message: 'La apellido es requerido.' },
      { type: 'pattern', message: 'Ingrese un apellido válido.' }
    ],
    'dni': [
      { type: 'pattern', message: 'El DNI debe contener 8 carácteres númericos.' },
      { type: 'required', message: 'El DNI es requerido.' },
    ],
    'cuil': [
      { type: 'pattern', message: 'El CUIL debe contener 11 carácteres númericos.' },
      { type: 'required', message: 'El CUIL es requerido.' },
    ],
    'profile': [
      { type: 'required', message: 'El perfil es requerido.' },
    ]
  };


  checkPasswords(): ValidatorFn {
    const passwordChecker = () => {
      const pass = this.form.get('password').value;
      const confirmPass = this.form.get('confirmPass').value;
      const isValidPassword = pass === confirmPass
      if (isValidPassword || confirmPass == "") return null;

      return { "passwordError": true }

    }
    return passwordChecker;
  }

  register(formValues) {
    this.formValuesToUser(formValues);

    if (this.image) {
      this.user.photo = this.image.name;
    }
    else {
      this.user.photo = null;
    }

    if (this.isClient) {
      this.user.profile = Profiles.Client;
      this.user.status = Status.PendingApproval;
    }

    if (this.modification) {
      this.userService.modifyUser(this.idObject, this.user).then(() => {
        this.notificationService.presentToast("Usuario modificado", "success", "middle");
        this.router.navigateByUrl('/listado/usuarios');
      });
    }
    else {
      this.userService.saveUserWithLogin(this.user).then(() => {
        if (this.isClient) {
          this.fcmService.getTokensByProfile(Profiles.Owner).then((userDevices: any[]) => {
            this.fcmService.sendNotification("Nuevo cliente!", 'Se requiere su aprobación', userDevices);
          });
          this.router.navigateByUrl('/login');
          this.notificationService.presentToast("Espere a que su cuenta sea confirmada", "primary", "middle");
        }
        else {
          this.notificationService.presentToast("Usuario creado", "success", "bottom");
          this.router.navigateByUrl('/listado/usuarios');
        }
      }).catch(() => this.notificationService.presentToast("La dirección de correo electrónico ya está siendo utilizada", "danger", "middle"));
    }
  }

  async takePhoto() {
    if (!this.image) {
      let imgName = `${this.user.name}-${Date.now()}`;
      await this.cameraService.takePhoto('usuarios', imgName);
      this.loadPhoto(imgName);
    }
    else {
      this.notificationService.presentToast("Solo se puede subir una foto.", "danger", "middle");
    }
  }

  deletePhoto(imgName) {
    this.cameraService.deleteImage('usuarios', imgName).then(
      resp => {
        this.image = null;
      },
      err => {
        this.notificationService.presentToast("Error al eliminar la foto.", "danger", "bottom");
      })
  }

  scan() {
    if (this.qrscannerService.device == "mobile") {
      this.qrscannerService.scanDni().then(data => {
        this.form.controls["surname"].setValue(data[1]);
        this.form.controls["name"].setValue(data[2]);
        this.form.controls["dni"].setValue(parseInt(data[4]));
      });
    }
  }

  async loadPhoto(imgName) {
    let imgUrl = await this.cameraService.getImageByName('usuarios', imgName);
    this.image = { "url": imgUrl, "name": imgName };
  }

  formValuesToUser(formValues) {
    this.user.name = formValues.name.trim();
    this.user.surname = formValues.surname.trim();
    this.user.email = formValues.email;
    this.user.password = formValues.password;
    this.user.dni = formValues.dni;

    if (!this.isClient) {
      this.user.cuil = formValues.cuil;
      this.user.profile = formValues.profile;
    }
  }
}
