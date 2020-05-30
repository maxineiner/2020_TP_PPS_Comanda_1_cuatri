import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NotificationService } from 'src/app/services/notification.service';
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
    private notificationService: NotificationService) {
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
      console.log("Latitude: " + resp.coords.latitude + " - Longitude: " + resp.coords.longitude);
      this.map.setCenter({ lat: resp.coords.latitude, lng: resp.coords.longitude });
      latLng = { lat: resp.coords.latitude, lng: resp.coords.longitude };
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
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  calculateAndDisplayRoute(formValues) {
    const that = this;
    this.directionsService.route({
      origin: formValues.source,
      destination: formValues.destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      console.log(status)
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
        var time = response.routes[0].legs[0].duration.text
        console.log(time);
        this.notificationService.presentToast(time, "black","bottom", false)
      } 
    });
  }

  fillWithLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("Latitude: " + resp.coords.latitude + " - Longitude: " + resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     })
  }

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
