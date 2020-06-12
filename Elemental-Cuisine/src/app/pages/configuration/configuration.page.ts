import { Component, OnInit } from '@angular/core';
import { SmartAudioService } from 'src/app/services/smart-audio.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage implements OnInit {

  private isActive:boolean = true;;

  constructor(
    private smartAudioService: SmartAudioService
  ) { }

  ngOnInit() {
  }

  activateSounds(){
    console.log(this.isActive);
    this.smartAudioService.activateSounds(this.isActive);
  }

}
