import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {google} from "@agm/core/services/google-maps-types";
import * as moment from "moment";


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, OnChanges {
  @Input() infoData;
  index:number;
  price:number = 0;
  constructor() { }
  ngOnChanges() {

  }
  ngOnInit() {

  }



  get OpeningHour() {
    var week_text = this.infoData.opening_hours.weekday_text;
    var utc_offset  = this.infoData.utc_offset;
    var day = moment().utcOffset(utc_offset).format('dddd');

    this.index = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].indexOf(day);
    return week_text[this.index];
  }
  starShow() {

    var ratio = this.infoData.rating/5*9.5;

    return ratio;
  }


}


