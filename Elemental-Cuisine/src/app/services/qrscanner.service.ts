import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class QrscannerService {

  device = "web";

  constructor(
    private scanner: BarcodeScanner, 

  ) { }

  scanDni(){
    let options = { prompt: "Escaneá el DNI", formats: "PDF_417" };

    this.scanner.scan(options).then(barcodeData => {
      return barcodeData.text.split('@');
    }).catch(err => { 
      console.log('Error', err);
    });
  }

  scanQr(){
    return this.scanner.scan().then(barcodeData => {
      return barcodeData.text;
    }).catch(err => { });
  }
}
