import { Component, OnInit } from '@angular/core';
import { PollService } from 'src/app/services/poll.service';
import { CameraService } from 'src/app/services/camera.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { NotificationService } from 'src/app/services/notification.service';
import { Poll } from 'src/app/classes/poll';

@Component({
  selector: 'app-poll-cliente',
  templateUrl: './poll-cliente.page.html',
  styleUrls: ['./poll-cliente.page.scss'],
})
export class PollClientePage implements OnInit {

  currentUser: User;
  private poll:Poll;

  // firebase = firebase;
  foto: string;
  fecha: string;


  encuestasClientes;
  encuestaClienteActual;
  encuestaCliente;
  public yaExiste=false;
  public opinion = 3;  

  public respuesta1: string="mujer";
  public respuesta2: string="Internet";
  public respuesta3: string="Muy Buena";
  public respuesta4: string="si";
  public respuesta5: string="Calidad";
  public respuesta6: string="buena";

  public correo: string ="";
  public comentario: string = "";
  public nombre:string="";
   
  constructor(private cameraService: CameraService, 
              private pollService: PollService,
              private notificationService: NotificationService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router ) {    
      
      this.poll = new Poll();
      console.log("poll", this.poll)
      this.obtenerUsuario();
      // this.obtenerEncuestas();  
      
      // this.encuestaExiste();    
   } 
  ngOnInit() {}
  obtenerUsuario(){
    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      this.router.navigateByUrl("/login");
    }
    this.userService.getUserById(user.uid).then(userData => {
      this.currentUser = Object.assign(new User, userData.data());
    })
   }

   showAlert() {
     Swal.fire({
        title: 'Custom width, padding, background.',
        width: 600,
        padding: '3em',
        backdrop: false
     })
    } 

  register(){ 
      this.pollService.savePollClient(this.poll).then(() => {
        this.notificationService.presentToast("Encuesta creada", "success", "top", false);
        // this.router.navigateByUrl('/listado/encu');
      });
    }  

  guardarEncuesta() {    
    if(this.currentUser.profile == "anonimo"){
      this.encuestaCliente= {
        "nombre": this.currentUser.name,      
        "respuesta1":this.respuesta1,        
        "respuesta2":this.respuesta2,        
        "respuesta3":this.respuesta3,       
        "respuesta4":this.respuesta4,        
        "respuesta5":this.respuesta5,       
        "respuesta6":this.respuesta6,
        "comentario": this.comentario
      }
    }
    else{
      this.encuestaCliente= {
        "nombre": this.currentUser.name,
        "correo":this.currentUser.email,
        "respuesta1":this.respuesta1,        
        "respuesta2":this.respuesta2,        
        "respuesta3":this.respuesta3,       
        "respuesta4":this.respuesta4,        
        "respuesta5":this.respuesta5,       
        "respuesta6":this.respuesta6,
        "comentario": this.comentario
      }
    }
 
  }

  takePhoto(){    
    this.cameraService.takePhoto('encuestas', Date.now());
  }

  
  modificarTextoRange() {
    let arrayAux = ['muy mala','mala','buena','muy buena','excelente'];
    this.respuesta6= arrayAux[this.opinion - 1];
   
  }
  //   if (this.yaExiste){
  //     this.encuestaCliente.id=this.encuestaClienteActual.id;
  //     this.auth.modificarEncuestaCliente(this.encuestaCliente).then(res => {
  //       this.error.mostrarMensaje("Se ha actualizado correctamente la encuesta.");
  //         this.navCtrl.setRoot(GraficoEncuestaClientePage);
  //        spiner.dismiss();        
      
  //     }).catch(error => {
  //       this.error.mostrarError(error,"error al guardar la encuesta");
  //       spiner.dismiss();
  //     });
  //   }
  //   else{
  //      this.auth.nuevaEncuestaCliente(this.encuestaCliente).then(res => {
  //       this.error.mostrarMensaje("Se ha cargado correctamente la encuesta.");
  //       spiner.dismiss();
  //       this.VolverAtras();
  //     }).catch(error => {
  //       this.error.mostrarError(error,"error al guardar la encuesta");
     
  //     });
  //   }
 

  // }

  

  // encuestaExiste(){
  //   this.auth.getEncuestasClientes().subscribe(lista => {
  //      this.encuestasClientes=lista;  
  //      console.log(this.encuestasClientes);
  //      for(let i=0;i<this.encuestasClientes.length;i++){
  //           if(this.encuestasClientes[i].correo == this.usuario.correo) {
  //               this.yaExiste=true;                
  //               this.encuestaClienteActual=this.encuestasClientes[i];
  //                              break;
  //           }
  //       }
  //   });
  // }
}