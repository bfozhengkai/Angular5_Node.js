import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ResultsComponent } from './results/results.component';
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { DetailsComponent } from './details/details.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { InfoComponent } from './details/info/info.component';
import { PhotosComponent } from './details/photos/photos.component';
import { MapComponent } from './details/map/map.component';
import { ReviewsComponent } from './details/reviews/reviews.component'
import {AgmCoreModule} from "@agm/core";

@NgModule({
  declarations: [
    AppComponent,
    ResultsComponent,
    DetailsComponent,
    FavoritesComponent,
    InfoComponent,
    PhotosComponent,
    MapComponent,
    ReviewsComponent,

  ],
  entryComponents: [
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      libraries: ["places"],
      apiKey:'AIzaSyB5HpnNpiDMGXftWGmx0Fg6bfPJDfJ_WPE'
    })

  ],
  providers: [

    ResultsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
