import { NgModule } from '@angular/core';
import { RwIonic3GoogleMapsAutocompleteInputComponent } from './rw-ionic3-google-maps-autocomplete-input/rw-ionic3-google-maps-autocomplete-input';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
	declarations: [RwIonic3GoogleMapsAutocompleteInputComponent],
	imports: [
		IonicModule,
		TranslateModule
	],
	exports: [RwIonic3GoogleMapsAutocompleteInputComponent]
})
export class RWIonic3GoogleMapsAutoCompleteComponentsModule { }
