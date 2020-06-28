import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { SmartAudioService } from './services/smart-audio.service';
import { FcmService } from './services/fcmService';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  showSplash: Boolean = false;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private smartAudioService: SmartAudioService,
    private fmcService: FcmService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // DESCOMENTAR_EN_PRODUCCION
      /*this.smartAudioService.preload('login', 'assets/sounds/login.mp3');
      this.smartAudioService.preload('simon1', 'assets/sounds/simon/simon1.mp3');
      this.smartAudioService.preload('simon2', 'assets/sounds/simon/simon2.mp3');
      this.smartAudioService.preload('simon3', 'assets/sounds/simon/simon3.mp3');
      this.smartAudioService.preload('simon4', 'assets/sounds/simon/simon4.mp3');*/
      //this.smartAudioService.play("login")
      timer(5000).subscribe( () => {
        this.showSplash = false;
      });
      this.fmcService.notificationSetup();

    });
  }
}
