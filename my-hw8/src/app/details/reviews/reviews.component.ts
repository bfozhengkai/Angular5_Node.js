import {ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
import {Http, Response} from "@angular/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {animate, state, style, transition, trigger} from "@angular/animations";
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition('void => *', [
        style({opacity:0}), //style only for transition transition (after transiton it removes)
        animate(1500, style({opacity:1})) // the new state of the transition(after transiton it removes)
      ]),
      transition('* => void', [
        animate(500, style({opacity:0})) // the new state of the transition(after transiton it removes)
      ])
    ])
  ]

})
export class ReviewsComponent implements OnInit, OnChanges {
  @Input() reviewJson;
  @Input() order;

  data:any[];
  showData: any[];
  display:string = 'google';
  constructor(private http: Http,private changeDetect: ChangeDetectorRef) { }
  showYelpData:any[];
  yelpData:any[];
  ngOnInit() {
    this.display = 'google';

      this.data = this.Copy(this.reviewJson.result.reviews);
      this.showData = this.data;

  }
  ngOnChanges() {

      this.data = this.Copy(this.reviewJson.result.reviews);
      this.showData = this.data;


  }
  googleReview() {
    document.getElementById('orderbutton').innerText = "Default Order";
    this.display = 'google';
    this.loadDefault();
    document.getElementById('reviewButton').innerText = 'Google Reviews';
    this.changeDetect.detectChanges();
  }
  yelpReview() {

    document.getElementById('orderbutton').innerText = "Default Order";
    var urlyelp = 'http://newnodejs-env.us-west-2.elasticbeanstalk.com/yelp?name=';
    var address = this.reviewJson.result.formatted_address;
    var country = 'US';
    var len = this.reviewJson.result.address_components.length;
    var state = this.reviewJson.result.address_components[len-3].short_name;
    var city  = this.reviewJson.result.address_components[len-4].short_name;
    urlyelp+=this.reviewJson.result.name+"&address1="+address;
    urlyelp+="&city="+city+"&state="+state+"&country="+country;
    console.log(urlyelp);
    this.http.get(urlyelp).map((response: Response)=> response.json()).subscribe( data=>{

      // this.reviewJson = data;
      // console.log(this.reviewJson);
      if (data.businesses.length == 0) {
        return;
      }
      var latitude = data.businesses[0].coordinates.latitude;
      var longitude = data.businesses[0].coordinates.longitude;
      var latfromgoogle = this.reviewJson.result.geometry.location.lat;
      var lonfromgoogle = this.reviewJson.result.geometry.location.lng;

      //Deep copy the useful data.Not use this.reviewJson.
      if (latitude<=latfromgoogle+0.05 && latitude>=latfromgoogle-0.05 && longitude>=lonfromgoogle-0.05 && longitude<=lonfromgoogle+0.05) {
        this.getYelpReview(data.businesses[0].id);
      }

      this.changeDetect.detectChanges();

    });
    this.display = 'yelp';
    document.getElementById('reviewButton').innerText = 'Yelp Reviews';


  }
  getYelpReview(Id) {
    let urlnear = 'http://newnodejs-env.us-west-2.elasticbeanstalk.com/yelpReview?Id=';
    urlnear+=Id;
    console.log(urlnear);
    this.http.get(urlnear).map((response: Response)=> response.json()).subscribe( data=>{

      this.showYelpData = this.Copy(data.reviews);
      console.log(this.showYelpData);
       this.yelpData = data.reviews;
      this.display = 'yelp';
      this.changeDetect.detectChanges();
    });
    this.display = 'yelp';

  }
  Copy (datas) {
    if (datas == undefined || datas.length==0) {
      return;
    }
    var res = [];
    var len = datas.length;
    for (var i = 0; i < len; i++) {
      var data = datas[i];
      var item = {};
      for (var k in data) {
        item[k] = data[k];
      }
      res.push(item);
    }
    return res;
  }
  loadDefault() {
      if(this.display == 'google') {
      this.order = 'default';
      this.showData = this.reviewJson.result.reviews;
      console.log(this.order);

      }
      else {
        this.yelpData = new Array();
        this.yelpData = this.Copy(this.showYelpData);
      }
      document.getElementById('orderbutton').innerText = "Default Order";
    this.changeDetect.detectChanges();
  }
  loadHightestRating() {
    if (this.display == 'google') {
      this.order = 'highest rating';
      console.log(this.order);
      this.showData = this.data.sort((a, b) => (b.rating - a.rating));

    }
    else {
      this.yelpData.sort((a,b)=>(b.rating-a.rating));
    }
    document.getElementById('orderbutton').innerText = "Highest Rating";
    this.changeDetect.detectChanges();
  }
  loadLowestRating() {
    if (this.display == 'google') {
      this.order = 'lowest rating';
      console.log(this.order);
      this.showData = this.data.sort((a, b) => (a.rating - b.rating));

    }
    else {
      this.yelpData.sort((a,b)=>(a.rating-b.rating));
    }
    document.getElementById('orderbutton').innerText = "Lowest Rating";
    this.changeDetect.detectChanges();
  }
  loadMostRecent() {
    if (this.display=='google') {
      this.order = 'most recent';
      console.log(this.order);
      this.showData = this.data.sort((a, b) => (b.time - a.time));
    }
    else {
      this.yelpData.sort((a,b)=>(this.compareToTimeStemp(b.time_created,a.time_created)));
    }
    document.getElementById('orderbutton').innerText = "Most Recent";
    this.changeDetect.detectChanges();
  }
  loadLeastRecent() {
    if (this.display == 'google') {
      this.order = 'least recent';
      console.log(this.order);
      this.showData = this.data.sort((a, b) => (a.time - b.time));

    }
    else {
      this.yelpData.sort((a,b)=>(this.compareToTimeStemp(a.time_created,b.time_created)));
    }
    document.getElementById('orderbutton').innerText = "Least Recent";
    this.changeDetect.detectChanges();
  }
  compareToTimeStemp (time1:string, time2:string) {
    var date1 = new Date(time1.replace(/-/g,'/'));
    var date2 = new Date(time2.replace(/-/g,'/'));
    this.changeDetect.detectChanges();
    return date1.getTime()-date2.getTime();
  }
  changeToTime (timestemp) {

    var datetime = new Date();
    datetime.setTime(timestemp);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    var mseconds = datetime.getMilliseconds();
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second+"."+mseconds;

  }

}

//https://api.yelp.com/v3/businesses/{QogSYy6pyCZOgvtDeV7X7g}?locale=usc
