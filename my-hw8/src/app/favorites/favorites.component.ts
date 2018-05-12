import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Response} from "@angular/http";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit,OnChanges {
  @Input() indexOfDetails;
  @Input() hasDetail:boolean;
  @Output() changeSite = new EventEmitter<string>();
  @Output() detailsShow = new EventEmitter()
  localStorage:Storage = window.localStorage;
  data:any[]=new Array();
  index:number = this.data.length;
  k:number  = 0;
  constructor() {}
  ngOnInit() {
      this.data = new Array();
      this.iter();
      this.index = this.data.length;
  }
  ngOnChanges() {

  }
  remove(i) {


    console.log('remove: '+ i);
    localStorage.removeItem(this.data[i].placeId);
    this.data.slice(i,i+1);

    console.log(this.index);
    this.index--;
    if (this.index==0) {
      this.data = new Array();
    }
    this.ngOnInit();
  }

  iter() {
    for (var i=0;i<this.localStorage.length;i++) {
      var item = localStorage.getItem(localStorage.key(i));
      this.data[i] = JSON.parse(item);
    }
    this.index = this.data.length;
  }
  changToDetail(placeId){
    this.changeSite.emit(placeId);

  }
  detailsShowing() {

    this.detailsShow.emit('details');
  }
  nextPage(k: number) {
    this.k = k;
  }
  prePage(k) {
    this.k = k;
  }
  changeToYellow(thisId) {
    if (thisId === this.indexOfDetails) {
      return "#fdd984"
    }
  }
}
