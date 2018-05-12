import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import  {AgmCoreModule} from "@agm/core";

import {MapsAPILoader} from "@agm/core";
import {} from "@types/googlemaps";
import {Http} from "@angular/http";
declare var google;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnChanges {
  @Input() mapStartLat;
  @Input() mapStartLon;
  @Input() mapEndLat;
  @Input() mapEndLon;
  @Input() infoData;
  @ViewChild("currentLoc")
  public locElementRef: ElementRef;
  mode:string = '';
  panorama :any;
  start:string;
  showStreet:boolean =true;
  constructor(private mapsAPILoader: MapsAPILoader, private http: Http, private changeDetect: ChangeDetectorRef) { }
  ngOnChanges() {
  }
  ngOnInit() {
      this.initMap();
       this.mapsAPILoader.load().then(() => {

      let autocomplete = new google.maps.places.Autocomplete(this.locElementRef.nativeElement, {

      });
    });


  }
  initMap() {
    let Panel = <HTMLElement>document.getElementById('Panel');
    Panel.innerHTML = "";
    var directionsService = new google.maps.DirectionsService;
    var startLatLon = {lat : this.mapStartLat, lng: this.mapStartLon};
    var endLatLon = {lat:this.mapEndLat,lng: this.mapEndLon};
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: startLatLon,
      streetViewControl: false
    });
    var directionsDisplay = new google.maps.DirectionsRenderer({
      draggable:true,
      map:map
    });
    var marker = new google.maps.Marker({
      position: endLatLon,
      map: map,
      title:'my-Map'
    });
    directionsDisplay.setMap(map);

    this.calculateAndDisplayRoute(startLatLon, endLatLon,directionsService, directionsDisplay);
    document.getElementById('getButton').addEventListener('click', ()=> {
      marker.setMap(null);
      this.getDirections (startLatLon, endLatLon, directionsService, directionsDisplay);
      this.changeDetect.detectChanges();
    });

    this.panorama = map.getStreetView();

    this.panorama.setPosition({lat: this.mapEndLat, lng: this.mapEndLon});
    this.panorama.setPov({
      heading: 265,
      pitch: 0
    });

  }
  getDirections (startLatLon, endLatLon, directionsService, directionsDisplay) {
    console.log("GET");
    if (this.start == undefined || this.start.length==0 || this.start === 'My location'){

      let url = 'http://ip-api.com/json';
      console.log(url);
      this.http.get(url).subscribe(res=>{
        this.mapStartLat = res.json().lat;
        this.mapStartLon = res.json().lon;
        startLatLon = {lat: this.mapStartLat, lng: this.mapStartLon};
        this.calculateAndDisplayRoute(startLatLon, endLatLon, directionsService, directionsDisplay);
        this.changeDetect.detectChanges();
      });
    }
    else {
      console.log(this.start);
      this.start = this.locElementRef.nativeElement.value;
      let url= "https://maps.googleapis.com/maps/api/geocode/json?address=" + this.start+
        "&key=AIzaSyB5HpnNpiDMGXftWGmx0Fg6bfPJDfJ_WPE";
      url = url.replace(" ", "+");
      console.log(url);
      this.http.get(url).subscribe(res=>{
        console.log(res.json());
        this.mapStartLat = res.json().results[0].geometry.location.lat;
        this.mapStartLon = res.json().results[0].geometry.location.lng;
        startLatLon = {lat: this.mapStartLat, lng: this.mapStartLon};
        this.calculateAndDisplayRoute(startLatLon, endLatLon, directionsService, directionsDisplay);
        this.changeDetect.detectChanges();

      });
    }

  }
  calculateAndDisplayRoute(startLatLon, endLatLon ,directionsService, directionsDisplay) {
    let panel = <HTMLElement>document.getElementById('Panel');
    panel.innerHTML="";
    let selectedMode = this.mode;
    directionsService.route({
      origin: startLatLon,
      destination: endLatLon,
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode[selectedMode]
    }, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
        directionsDisplay.setPanel(document.getElementById('Panel'));
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }


  streetView() {
    var toggle = this.panorama.getVisible();
    if (toggle == false) {
      this.panorama.setVisible(true);
      this.showStreet = false;
      this.changeDetect.detectChanges();
    } else {
      this.panorama.setVisible(false);
      this.showStreet = true;
      this.changeDetect.detectChanges();
    }
  }

}
