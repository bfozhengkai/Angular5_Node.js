
import { NgModule} from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import {MapComponent} from "./map.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MarkerManager} from "@agm/core";
import { InfoWindowManager} from "@agm/core";


@NgModule({
  declarations: [
    MapComponent,

  ],

  imports: [
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      libraries: ["places"],
      apiKey:'AIzaSyB5HpnNpiDMGXftWGmx0Fg6bfPJDfJ_WPE'
    })

  ],
  providers: [
    MarkerManager,
    InfoWindowManager,
  ],
  bootstrap: [MapComponent]
})
export class MapModule { }
