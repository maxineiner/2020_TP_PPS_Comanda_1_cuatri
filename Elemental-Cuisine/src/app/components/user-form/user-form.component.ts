import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { CameraService } from 'src/app/services/camera.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {

  @Input() isClient:boolean;
  private user:User;

  constructor(
    private router: Router,
    private userService: UserService,
    private cameraService: CameraService,
    private qrscannerService: QrscannerService,
    private notificationService: NotificationService
  ) { 
    this.user = new User();
  }

  ngOnInit() {}

  register(){ 
    if(this.isClient){
      this.user.profile = "cliente";
      this.user.status = "sinAtender";
    }
    this.userService.saveUserWithLogin(this.user).then(response =>{
      if(this.isClient){
        this.router.navigate(['/home']);
      }
      else{
        this.notificationService.presentToast("Empleado creado", "success", "bottom", false);
        this.router.navigateByUrl('/listado/usuarios');
      }
    });
  }  

  takePhoto(){
    //Cambiar nombre de la foto (segundo parametro)
    this.cameraService.takePhoto('clientes', Date.now());
  }

  scan(){
    let dniData = this.qrscannerService.scanDni();
    alert(dniData);
  }

}
