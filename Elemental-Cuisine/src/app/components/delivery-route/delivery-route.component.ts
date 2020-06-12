import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/services/notification.service';
declare var google:any;

@Component({
  selector: 'app-delivery-route',
  templateUrl: './delivery-route.component.html',
  styleUrls: ['./delivery-route.component.scss'],
})
export class DeliveryRouteComponent implements OnInit, AfterViewInit {

  @ViewChild('mapElement', { static: false }) mapNativeElement: ElementRef;
  @ViewChild('source', { read: ElementRef, static: false }) startLocationElement: ElementRef
  @ViewChild('destination', { read: ElementRef, static: false }) endLocationElement: ElementRef

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  form: NgForm;
  map;
  time: String = "";
  @Output() sendTime: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    private geolocation: Geolocation,
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    let latLng = { lat: -34.61, lng: -58.37 }
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 11,
      center: latLng,
      disableDefaultUI: true,
    });

    this.geolocation.getCurrentPosition().then((resp) => {
      let latitude = resp.coords.latitude;
      let longitude = resp.coords.longitude;
      this.fillWithLocation(latitude, longitude);
      this.map.setCenter({ lat: latitude, lng: longitude });
      latLng = { lat: latitude, lng: longitude };
     }).catch((error) => {
       console.log('Error getting location', error);
     }).finally(() => {
        new google.maps.Marker({
          position: latLng,
          map: this.map
        });
     }); 
    this.locationAutocomplete();
    this.directionsDisplay.setMap(this.map);
  }

  // Calcula el tiempo del trayecto y lo despliega en el mapa
  calculateAndDisplayRoute(formValues) {
    const that = this;
    this.directionsService.route({
      origin: formValues.source,
      destination: formValues.destination,
      travelMode: 'DRIVING',
      region: 'ar'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
        this.time = response.routes[0].legs[0].duration.text;
        this.notificationService.presentToast(`Tiempo de entrega estimado: ${this.time}`, "primary", "top")
      } 
    });
  }

  // Completa el campo de "Partida" con la dirección tomada del GPS
  fillWithLocation(latitude, longitude){
    this.geocode(latitude, longitude).subscribe((response:any) => {
      if(response.status === "OK") {
        this.endLocationElement.nativeElement.value = response.results[0].formatted_address;
      }
      this.startLocationElement.nativeElement.value = "Avenida Bartolomé Mitre 750, Avellaneda";
    });
  }

  geocode(latitude, longitude){
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAGS1es2kjUoVdPlWCg3WGQ21iWxKufGXA`);
  }

  // Permite tener un buscado de direcciones correspondientes a Argentina
  locationAutocomplete(){
    var options = {
      componentRestrictions: {country: 'ar'}
    };

    this.startLocationElement.nativeElement.getInputElement().then(input => {
      var autocomplete = new google.maps.places.Autocomplete(input,options);
    });
    this.endLocationElement.nativeElement.getInputElement().then(input => {
      var autocomplete = new google.maps.places.Autocomplete(input,options);
    });
  }

  sendRoute(){
    this.sendTime.emit({"time": this.time, "destination": this.endLocationElement.nativeElement.value});
  }

}
