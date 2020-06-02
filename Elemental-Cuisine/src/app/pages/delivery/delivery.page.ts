import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NotificationService } from 'src/app/services/notification.service';
import { HttpClient } from '@angular/common/http';
declare var google:any;

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit, AfterViewInit {

  @ViewChild('mapElement', { static: false }) mapNativeElement: ElementRef;
  @ViewChild('startLocationSearch', { read: ElementRef, static: false }) startLocationElement: ElementRef
  @ViewChild('endLocationSearch', { read: ElementRef, static: false }) endLocationElement: ElementRef

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  map;

  constructor(
    private fb: FormBuilder,
    private geolocation: Geolocation,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {
    this.createDirectionForm();
  }

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

  createDirectionForm() {
    this.directionForm = this.fb.group({
      source: [Validators.required],
      destination: ['', Validators.required]
    });
  }

  // Calcula el tiempo del trayecto y lo despliega en el mapa
  calculateAndDisplayRoute(formValues) {
    console.log(formValues)
    const that = this;
    this.directionsService.route({
      origin: formValues.source,
      destination: formValues.destination,
      travelMode: 'DRIVING',
      region: 'ar'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
        let time = response.routes[0].legs[0].duration.text;
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

}
