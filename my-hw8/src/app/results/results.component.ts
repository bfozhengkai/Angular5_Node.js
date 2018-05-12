import {AfterContentInit, Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter} from '@angular/core';

import {Http} from "@angular/http";
import {
  trigger,
  state,
  style,
  animate,
  transition, keyframes
} from '@angular/animations';
import {Response} from "@angular/http";
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],

})


export class ResultsComponent implements OnChanges, OnInit {
  @Input() resultsData: any;
  @Input() lat:number;
  @Input() lon: number;
  @Input() hasDetail:boolean;
  @Input() indexOfDetails:string;
  @Output() changeSite = new EventEmitter<string>();
  @Output() detailsShow = new EventEmitter<string>();
  display:string = 'results';
  public isSubmit: boolean;
  k : number = 0 ;
  state = 'in';
  results:any[] = new Array();
  index:number=0;
  myStorage = window.localStorage;
  constructor( private http : Http) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.lat);
    console.log(this.lon);
    console.log(this.isSubmit);
    if (!this.isSubmit) {
      this.k = 0;
      this.results = new Array();
    }
    if (this.resultsData != null) {
      var appendResults = this.resultsData.results;
      this.results = appendResults;
    }

  }

  prePage(k: number) {
    this.k = k;
  }

  nextPage(k: number) {
    if(this.resultsData.next_page_token != undefined){
      console.log(this.resultsData.next_page_token);
      this.isSubmit = false;
      let url = 'http://newnodejs-env.us-west-2.elasticbeanstalk.com/next_token?token=';
      url+=this.resultsData.next_page_token;
      console.log(url);
      this.http.get(url).map((response: Response)=> response.json()).subscribe( data=>{
          this.results = this.results.concat(data.results);
          this.k = k;
      });
    }
  }
  changToDetail(placeId: string) {
    var ele = "!!!"+placeId;
    let row= <HTMLElement>document.getElementById(ele);
    row.style.backgroundColor = "#fdd984";
    this.changeSite.emit(placeId);

  }
  changeToYellow(thisId) {
    if (thisId === this.indexOfDetails) {
      return "#fdd984"
    }
  }
  changeStorageData(str:string) {

    var strs = str.split('#&!');
    if (<HTMLElement>document.getElementById(strs[3]) == null) {
      return;
    }
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
  storeTheData(icon, name, address, placeId) {
    var nameofItem = placeId;
    var info = JSON.stringify({icon: icon, name: name, address: address, placeId: placeId});
    this.myStorage.setItem(nameofItem, info);
    console.log(info);
  }
  detailsShowing() {

      this.detailsShow.emit('details');

  }


}

//https://maps.googleapis.com/maps/api
// /place/nearbysearch/json?pagetoken=
// CpQCAgEAAFxg8o-eU7_uKn7Yqjana-HQIx1hr5BrT
// 4zBaEko29ANsXtp9mrqN0yrKWhf-y2PUpHRLQb1GT-mtxNcXou8TwkXhi
// 1Jbk-ReY7oulyuvKSQrw1lgJElggGlo0d6indiH1U-tDwquw4tU_UXoQ_sj8OB
// o8XBUuWjuuFShqmLMP-0W59Vr6CaXdLrF8M3wFR4dUUhSf5UC4QCLaOMVP92lyh
// 0OdtF_m_9Dt7lz-Wniod9zDrHeDsz_by570K3jL1VuDKTl_U1cJ0mzz_zDHGfOUf
// 7VU1kVIs1WnM9SGvnm8YZURLTtMLMWx8-doGUE56Af_VfKjGDYW361OOIj9Gmk
// yCFtaoCmTMIr5kgyeUSnB-IEhDlzujVrV6O9Mt7N4DagR6RGhT3g1viYLS4kO5YindU6dm3GIof1Q&key=
