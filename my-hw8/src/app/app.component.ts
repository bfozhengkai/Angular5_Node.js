import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MapForm} from './mapForm';
import {Http, Response, RequestOptions, Headers} from "@angular/http";
import 'rxjs/add/operator/map';
import {ResultsComponent} from "./results/results.component";
import { } from "@types/googlemaps";
import {AgmCoreModule, MapsAPILoader} from "@agm/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {} from "@types/googlemaps";
import * as moment from "moment";
declare var google;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      state('out', style({transform: 'translateX(100%)'})),
      transition('in => out', animate('600ms ease-in', style({
        transform: 'translateX(100%)'
      }))),
      transition('out => in', animate('600ms ease-in', style({
        transform: 'translateX(0)'
      }))),
    ]),
    trigger('flyInOutDetail', [
      state('in', style({transform: 'translateX(0)'})),
      state('out', style({transform: 'translateX(-100%)'})),
      transition('in => out', animate('600ms ease-in', style({
        transform: 'translateX(-100%)'
      }))),
      transition('out => in', animate('600ms ease-in', style({
        transform: 'translateX(0)'
      }))),
    ])
  ],

})
export class AppComponent implements OnInit{
  @ViewChild('keyword')
    public keywordElementRef : ElementRef;
  @ViewChild('location')
    public hereLocElementRef : ElementRef;
  display:string = ' ';
service: google.maps.places.PlacesService;
category = ['default','airport','amusement_park','aquarium',
'art_gallery','bakery','bar','beauty_salon','bowling_alley','bus_station'
    ,'cafe','campground','car_rental','casino','lodging','movie_theater',
    'museum','night_club','park','parking','restaurant','shopping_mall','stadium'
    ,'subway_station','taxi_stand','train_station','transit_station','travel_agency',
    'zoo'
  ];
model = new MapForm('',this.category[0],10,'');
hasHere:number=0;
submitted = false;
appJson: any;
detailsJson:any;
placeId:string;
photos:Array<any> = new Array();
showbar:number = 1;
hasDetail:boolean = false;
constructor(private http: Http, private resultComponent : ResultsComponent, private mapsAPILoader: MapsAPILoader, private changeDetect: ChangeDetectorRef){};
latForStart: number=0;
lngForStart: number =0;
latForEnd: number = 0;
lonForEnd: number = 0;
state:string = 'in';
stateDetail:string = 'out';
valide:boolean = true;
isError:boolean = true;
allGood:boolean = false;
valide2:boolean = true;
indexOfDetails:string = '';
ngOnInit() {
  this.mapsAPILoader.load().then(() => {

    let autocomplete2 = new google.maps.places.Autocomplete( <HTMLElement>document.getElementById('location'), {

    });

  });

}

send2() {
  this.hasHere=1;
  this.allGood = false;
}
send1() {
  this.model.here = "";
  this.hasHere=0;
  this.valide2 = true;
  this.allGood = true;
  this.hereLocElementRef.nativeElement.style.borderColor = 'white';
}
setSubmit() {
  this.submitted = true;
  if (this.display=== 'details') {
    this.toggle();
  }
  this.display=' ';
  console.log(this.submitted);
}
onSubmit() {
  this.submitted = true;
  this.GETcurrentLoc();


}
get enterKeyword() {
  var str = this.model.keyword.replace(/(^\s*)/g,"");
  return str;
}
get enterHere() {
  var str = this.model.here.replace(/(^\s*)/g,"");
  return str;
}
clearPage() {
  if (this.display=== 'details') {
    this.toggle();
  }
  this.allGood=false;
  this.model.keyword = '';
  this.model.here = '';
  this.model.distance=10;
  this.model.category = this.category[0];
  this.display=' ';
}
validate(str:string) {
  console.log(1);
  if (!this.valide) {
    this.keywordElementRef.nativeElement.style.borderColor= 'red';
  }
  else  {
    this.keywordElementRef.nativeElement.style.borderColor= 'white';
  }
  this.valide = !(/^[ ]*$/).test(str);
  this.isError = (/^[ ]*$/).test(str);

  this.allGood = this.valide && this.valide2;
  console.log(this.valide);
  console.log(this.isError);
  return this.valide;
}
validate2(str:string) {
  if (this.hasHere==1) {
    console.log(2);
    if (!this.valide2) {
      this.hereLocElementRef.nativeElement.style.borderColor = 'red';
    }
    else {
      this.hereLocElementRef.nativeElement.style.borderColor = 'white';
    }
    this.valide2 = !(/^[ ]*$/).test(str);

    this.allGood = this.valide && this.valide2;
    console.log(this.valide2);

    return this.valide2;
  }

}
changeSite(place_id: string) {
    this.indexOfDetails = place_id;
    var request = {
      placeId: place_id
    };
    this.photos = new Array<any>();
    this.mapsAPILoader.load().then(()=> {
      this.service = new google.maps.places.PlacesService(document.createElement('div'));
      this.service.getDetails(request, (response)=> {
        this.detailsJson = response;
        console.log(response);
        if (response.photos != undefined){
          for (var i=0;i<response.photos.length;i++) {
            this.photos[i] = response.photos[i].getUrl({'maxWidth':response.photos[i].width,'maxHeight': response.photos[i].height});
          }
          console.log(this.photos);
        }
        this.latForEnd = response.geometry.location.lat();
        this.lonForEnd = response.geometry.location.lng();
        this.placeId = place_id;
        console.log(this.placeId);
        this.hasDetail = true;
        this.display = 'details';
        this.toggle();
        this.changeDetect.detectChanges();
    });

  });
}
changeToList(display:string) {
  if (this.display === 'details') {
    this.toggle();
  }

  this.display = display;

  this.changeDetect.detectChanges();
}
showDetails (display:string) {
  this.toggle();
  this.display = display;
  this.changeDetect.detectChanges();
}
GETcurrentLoc() {
  console.log("GET");
  this.showbar = 0;
  if (this.model.here == undefined || this.model.here==null ||this.model.here.length==0){

    let url = 'http://ip-api.com/json';
    console.log(url);
    this.http.get(url).subscribe(res=>{

      console.log(res.json());
      this.latForStart = res.json().lat;
      this.lngForStart = res.json().lon;
      this.GETNearBy(this.latForStart, this.lngForStart);
      this.changeDetect.detectChanges();
    });
  }
  else {
    let url="http://newnodejs-env.us-west-2.elasticbeanstalk.com/request?request=";
     url+=this.hereLocElementRef.nativeElement.value;
    url.replace(" ", "+");
    console.log(url);
    this.http.get(url).subscribe(res=>{
      console.log(res.json());
      this.latForStart = res.json().results[0].geometry.location.lat;
      this.lngForStart = res.json().results[0].geometry.location.lng;
      this.GETNearBy(this.latForStart, this.lngForStart);
      this.changeDetect.detectChanges();
    });
  }

}
GETNearBy(lat, lng) {
  var distance = 0;
  if (this.model.distance == null) {
    distance = 10 * 1609;
  }
  else {
    distance = this.model.distance * 1609;
  }
  var cate=this.category[0];
  if (this.model.category!=null) {
    cate = this.model.category;
  }
  let urlnear = 'http://newnodejs-env.us-west-2.elasticbeanstalk.com/nearby?lat=';
  urlnear+=lat+"&lng="+lng;
  urlnear+="&radius="+distance+"&type="+cate+"&keyword="+this.keywordElementRef.nativeElement.value;
  urlnear.replace(" ", "+");
  console.log(urlnear);
  this.http.get(urlnear).map((response: Response)=> response.json()).subscribe( data=>{

    this.appJson = data;
    this.showbar=1;
    this.display = 'results';
    this.changeDetect.detectChanges();
  });
}
resultsButton() {
  let result = <HTMLElement>document.getElementById('ResultsButton');
  result.className = "btn btn-primary btn-sm";
  result.style.color = "white";
  let favor = <HTMLElement>document.getElementById('FavorButton');
  favor.className = "btn btn-light btn-sm";
  favor.style.color = '#05adfb';
  console.log(1);
  if (this.display === 'details') {
    this.toggle();
  }
  this.display='results';
  this.changeDetect.detectChanges();
}
favorButton() {
  let result = <HTMLElement>document.getElementById('ResultsButton');
  result.className = "btn btn-light btn-sm";
  result.style.color = '#05adfb';
  let favor = <HTMLElement>document.getElementById('FavorButton');
  favor.className = "btn btn-primary btn-sm";
  favor.style.color = "white";
  console.log(1);
  if (this.display === 'details') {
    this.toggle();
  }
  this.display='favorites';
  this.changeDetect.detectChanges();
}
get diagnostic() {
  return JSON.stringify(this.model);
}

get getLatForStart() {
  return this.latForStart;
}
get getLngForStart() {
  return this.lngForStart;
}


toggle() {

    this.state = (this.state === 'in' ? 'out' : 'in');
    this.stateDetail = (this.stateDetail === 'out' ? 'in':'out');

}
get indexOpenHoursData() {
  var utc_offset  = this.detailsJson.utc_offset;
  var day = moment().utcOffset(utc_offset).format('dddd');

  var index = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].indexOf(day);
  return index;
}
}
