import { Component } from '@angular/core';

@Component({
  selector: 'rw-ionic3-google-maps-autocomplete-input',
  templateUrl: 'rw-ionic3-google-maps-autocomplete-input.html'
})
export class RwIonic3GoogleMapsAutocompleteInputComponent {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
