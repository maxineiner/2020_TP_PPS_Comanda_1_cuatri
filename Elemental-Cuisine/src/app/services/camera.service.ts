import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NotificationService } from './notification.service';
import * as firebase from 'firebase/app';
import "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private image: string;
  constructor(
    private camera: Camera,
    private notificationService: NotificationService
  ) { }

  async takePhoto(collection, imageName) {
    let options: CameraOptions = {
      quality: 50,
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    try {
      let result = await this.camera.getPicture(options);
      let image = `data:image/jpeg;base64,${result}`;
      //guardo en Firebase Storage
      let pictures = firebase.storage().ref(`${collection}/${imageName}`);
      //tomo url de foto en Firebase Storage
      return pictures.putString(image, "data_url").then(() => {
        return pictures.getDownloadURL().then((url) => {
          this.notificationService.presentToast("Foto guardada con éxito.", "success", "bottom");
          // alert("Foto guardada con éxito: " + url);
          return url;
        });
      });
    } 
    catch (error) {
      alert(error);
    }
  }

  getImageByName(collection, imageName) {
    return firebase.storage().ref(`${collection}/${imageName}`).getDownloadURL();
  }

  deleteImage(collection, imageName) {
    return firebase.storage().ref(`${collection}/${imageName}`).delete();
  }
}
