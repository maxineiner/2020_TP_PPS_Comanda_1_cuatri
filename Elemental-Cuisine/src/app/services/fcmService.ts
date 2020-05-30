import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FCM } from '@ionic-native/fcm/ngx';
import { DataService } from './data.service';
import { NotificationService } from './notification.service';
import { Collections } from 'src/app/classes/enums/collections';
import { User } from '../classes/user';
import { SmartAudioService } from './smart-audio.service';

@Injectable()
export class FcmService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'key=AAAA0TsmZ2E:APA91bGT3AsRQz1SWKT_lIaUxFeweYs-KStunNKIeJFWjg3l-KzU9GldGdwGvy_ZfF1y1ig9774bk5lvm1S6aCrOq4SLLh0H3CmOuS354CtX55cBIH0EUI9gvfwbAqtF2GXmulyamUvo'
  })

  constructor(private dataService: DataService,
              private authService: AuthService,
              private notificationService: NotificationService,
              private smartAudioService: SmartAudioService,
              private http: HttpClient,
              private fcm: FCM) {}

  getToken() {
    this.fcm.getToken().then(token => {
      console.log(token);
      this.saveToken(token);
    }).catch(error => {
      console.log("Error getting token: " + error);
    });
  }

  private saveToken(token) {
    if (!token) return;

    const data = {
      token,
      userId: this.authService.getCurrentUser().uid
    };

    return this.dataService.setData('dispositivos', data);
  }

  notificationSetup() {
      //Validar si hace falta
      /*this.fcm.onTokenRefresh().subscribe((token:string) => {
        console.log("Actualización de Token: " + token);
      });*/

      this.fcm.onNotification().subscribe(data => {
        this.smartAudioService.play("login")
        if(data.wasTapped){
          console.log("Segundo plano: " + JSON.stringify(data))
        }
        //Aplicación en primer plano
        else{
          this.notificationService.presentToast(data.body,"primary","top", true);
        }
      }, error => {
        console.log("Error: " + error);
      })
  }

  getTokensByProfile(userProfile){
      return new Promise((resolve) => { 
        this.dataService.getAll(Collections.Users).subscribe(users => {
        let usersByProfile = users.map(user => user.payload.doc.data() as User).filter(user => user.profile == userProfile)
        this.dataService.getAll(Collections.Devices).subscribe(devices => {
          let devicesByProfile = devices.map(device => device.payload.doc.data() as any)
                                        .filter(device => usersByProfile.some(user => user.id == device.userId))
                                        .map(device => device.token);
          resolve(devicesByProfile);
        });
      });
    });
  }

  sendNotification(title, message, redirectTo, to) {
    console.log(to);
    let body = {
      "notification":{
        "title": title,
        "body": message,
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "redirectTo": redirectTo
      },
        //Un solo ID, topico o grupo
        //"to": to,
        // Multiples IDs
        "registration_ids": to,
        "priority":"high"
    }

    return this.http.post("https://fcm.googleapis.com/fcm/send", body, { headers: this.headers }).subscribe();
  }

}