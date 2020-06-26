import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { RwIonic3GoogleMapsAutocompleteInputComponent } from './rw-ionic3-google-maps-autocomplete-input/rw-ionic3-google-maps-autocomplete-input';
import { FormsModule } from '@angular/forms';
@NgModule({
	declarations: [RwIonic3GoogleMapsAutocompleteInputComponent],
	imports: [
		IonicModule,
		BrowserModule,
		FormsModule,
		TranslateModule
	],
	exports: [RwIonic3GoogleMapsAutocompleteInputComponent]
})
export class RWIonic3GoogleMapsAutoCompleteComponentsModule { }
