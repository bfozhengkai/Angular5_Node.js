import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Http, Response} from "@angular/http";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnChanges{
@Input() detailsData;
@Input() photoData;
@Input() lonData;
@Input() latData;
@Input() lonForEnd;
@Input() latForEnd;
@Input() placeId;
@Output() changeList = new EventEmitter<string>();
myStorage = window.localStorage;
order = 'default';
display: string = 'info';
reviewJson:any;
  constructor(private http: Http,private changeDetect: ChangeDetectorRef) { }
  ngOnChanges() {
  }
  ngOnInit() {
  }
  loadMap() {
    this.display = 'map';
    this.changeDetect.detectChanges();
  }
  loadPhotos() {

    this.display = 'photos';
    this.changeDetect.detectChanges();
  }
  loadInfo() {
    this.display = 'info';
    this.changeDetect.detectChanges();
  }
  loadReviews() {
    var urlreview = 'http://newnodejs-env.us-west-2.elasticbeanstalk.com/placeId?placeId=';
    urlreview+=this.placeId;
    console.log(urlreview);
    this.http.get(urlreview).map((response: Response)=> response.json()).subscribe( data=>{

      this.reviewJson = data;
      this.display = 'reviews';
      this.changeDetect.detectChanges();
    });


  }
  changeToList() {
    this.changeList.emit('results');
  }
  twitter() {
    var tweetStr = "https://twitter.com/intent/tweet?text=";
    var url = this.detailsData.website != undefined ? this.detailsData.website : this.detailsData.url;
    tweetStr+= "Check out "+this.detailsData.name+" located at "+this.detailsData.formatted_address+". Website: "+url+" #TravelAndEntertainmentSearch.";
    tweetStr.replace(" ",'+');
    return tweetStr;
  }
  storeTheData(icon, name, address, placeId) {

    var nameofItem = placeId;
    var info = JSON.stringify({icon: icon, name: name, address: address, placeId: placeId});
    this.myStorage.setItem(nameofItem, info);
    console.log(info);
  }
  changeStorageData(str:string) {

    var strs = str.split('#&!');
    let star= <HTMLElement>document.getElementById(strs[3]);
    if (star.className == 'fa fa-star-o') {
      star.className = "fa fa-star";
      star.style.color = "yellow";
      this.storeTheData(strs[0],strs[1],strs[2],strs[3]);
    }
    else {
      star.className = "fa fa-star-o";
      star.style.color = "black";
      this.myStorage.removeItem(strs[3]);
    }
  }

}
