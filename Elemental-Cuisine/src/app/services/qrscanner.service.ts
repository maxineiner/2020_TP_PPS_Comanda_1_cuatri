import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class QrscannerService {

  device = (this.platform.is("mobileweb") || this.platform.is("desktop")) ? "web" : "mobile";

  constructor(
    private scanner: BarcodeScanner, 
    private platform: Platform
  ) { }

  scanQr(options?){
    return this.scanner.scan(options).then(barcodeData => {
      return barcodeData.text;
    }).catch(err => { });
  }

  scanDni(){
    let options = { prompt: "Escaneá el DNI", formats: "PDF_417" };

    return this.scanQr(options).then((response: string) => {
      return response.split('@');
    });
  }

}
