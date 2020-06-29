import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import Swal, { SweetAlertType } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading;

  constructor(private loadingCtrl: LoadingController, private router: Router) { }

  ngOnInit() {
  }

  async showLoading(message = "Espere...", duration = null) {

    this.loadingCtrl.create({
      duration: duration,
      spinner: null,
      cssClass: 'spinner',
      message:  '<div class="spinner">' +
                  '<ion-img src="/assets/images/brand-4.png""></ion-img>' +
                  '<br><span>' + message + '</span>' +
                '</div>'
    }).then((overlay) => {
      this.loading = overlay;
      this.loading.present();
    });
  }

  closeLoading(title?: string, message?: string, typeNotification?: SweetAlertType, duration = 2000) {
    setTimeout(() => {
      this.loading.dismiss();
      
      if (message) {
        Swal.fire({
          type: typeNotification,
          title: title,
          text: message,
          backdrop: false
        });
      }
    }, duration);
  }

  closeLoadingAndRedirect(route: string) {
    setTimeout(() => {
      this.loading.dismiss();
      this.router.navigateByUrl('/inicio');
    }, 2000);
  }
}
