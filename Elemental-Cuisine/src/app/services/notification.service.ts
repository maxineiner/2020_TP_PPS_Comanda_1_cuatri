import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toastController: ToastController,
    private router: Router
  ) { }

  async presentToast(message, color, position, closeButton: boolean = false) {
    const toast = await this.toastController.create({
      message: message,
      duration: (closeButton) ? 0 : 3000,
      position: position,
      color: color,
      showCloseButton: closeButton,
      closeButtonText: "Aceptar"
    });

    if (closeButton == true) {
      toast.onDidDismiss().then(() => {
        //this.router.navigateByUrl(url)
      });

    }
    toast.present();
  }
}
