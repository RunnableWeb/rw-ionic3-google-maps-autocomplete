import { Component, OnInit, NgZone, Input, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS, NgForm } from '@angular/forms';

declare const google: any;

@Component({
  selector: 'rw-ionic3-google-maps-autocomplete-input',
  templateUrl: 'rw-ionic3-google-maps-autocomplete-input.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: RwIonic3GoogleMapsAutocompleteInputComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: RwIonic3GoogleMapsAutocompleteInputComponent, multi: true }
  ]

})
export class RwIonic3GoogleMapsAutocompleteInputComponent implements ControlValueAccessor, OnInit, Validator {

  @Input() required: boolean = false;
  @Input() placeholder: string = "";
  @Input() form: NgForm;

  @ViewChild('inputContainer') inputContainer: ElementRef;

  GoogleAutocomplete: any;
  autocomplete: IFormGooglePlacesInput;
  autocompleteItems: any[];
  geocoder: any;
  onchange: any;
  inputWasFocused: boolean = false;
  constructor(public zone: NgZone) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder;
    this.autocomplete = { value: '', location: { lat: 0, lng: 0 } };
    this.autocompleteItems = [];
  }
  ngOnInit(): void { }
  isFormSubmitted() {
    if (this.form)
      return this.form.submitted;
    return false;
  }
  onBlur() {
    this.inputWasFocused = true;
    this.validate();
  }
  updateSearchResults() {
    const query = this.autocomplete.value.trim();
    if (query == '') {
      this.autocompleteItems = [];
      return;
    } else if (query.length > 2) {
      this.GoogleAutocomplete.getPlacePredictions({ input: query },
        (predictions, status) => {
          this.autocompleteItems = [];
          this.zone.run(() => {
            if (predictions) {
              predictions.forEach((prediction) => {
                if (this.autocompleteItems.length < 3)
                  this.autocompleteItems.push(prediction);
              });
            }
          });
        });
    }
  }

  selectSearchResult(item) {
    console.log(item);

    this.autocomplete.value = item.description
    this.autocompleteItems = [];
    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.autocomplete.location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };

        this.onchange(this.autocomplete);

      }
    })
  }

  registerOnChange(fn: any): void {
    this.onchange = fn;
  }
  validate() {
    //we need to find a way to change text color on error    
    console.log(this.inputContainer);

    if ((!this.autocomplete.value || !this.autocomplete.location.lat || !this.autocomplete.location.lng) && this.required && this.inputWasFocused) {
      // this.inputContainer.nativeElement.className = 'input-container input-container-error';
      return {
        "location": "location not valid"
      };
    }
    // this.inputContainer.nativeElement.className = 'input-container';
    return null
  }
  writeValue(value: IFormGooglePlacesInput): void {
    if (value) {
      this.autocomplete = value;
    }
  }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }
  registerOnValidatorChange?(fn: () => void): void { }
}

export interface IFormGooglePlacesInput {
  value: string;
  location: {
    lat: string | number;
    lng: string | number
  }
}
