import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { SmartAudioService } from './services/smart-audio.service';
import { FcmService } from './services/FcmService';

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
      this.smartAudioService.preload('login', 'assets/sounds/login.mp3');
      //this.smartAudioService.play("login")
      timer(5000).subscribe( () => {
        this.showSplash = false;
      });
      this.fmcService.notificationSetup();

    });
  }
}
