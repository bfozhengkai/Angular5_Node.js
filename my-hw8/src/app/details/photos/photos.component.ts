import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  @Input() infoData;
  @Input() photos;
  constructor() { }

  ngOnInit() {
  }

}
