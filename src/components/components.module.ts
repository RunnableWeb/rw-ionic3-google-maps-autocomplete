import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { RwIonic3GoogleMapsAutocompleteInputComponent } from './rw-ionic3-google-maps-autocomplete-input/rw-ionic3-google-maps-autocomplete-input';
@NgModule({
	declarations: [RwIonic3GoogleMapsAutocompleteInputComponent],
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		TranslateModule
	],
	exports: [RwIonic3GoogleMapsAutocompleteInputComponent]
})
export class RWIonic3GoogleMapsAutoCompleteComponentsModule { }
