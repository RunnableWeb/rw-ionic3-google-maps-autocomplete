import { Component, OnInit, NgZone, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, NG_VALIDATORS, NgForm } from '@angular/forms';
import { TextInput } from 'ionic-angular';
import { ERWInputType } from '../../enums';

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
  @Input() model: IRWionic3GoogleMapsAutocompleteInputModel = {
    placeholder: "",
    form: null,
    hideIcon: false,
    multiple: false,
    checkBoxColor: 'primary',
    inputType: ERWInputType.fixed,
    iconColor: 'primary'
  };

  @Input() required = false;

  @ViewChild('inputContainer') inputContainer: ElementRef;
  @ViewChild('searchInput') searchInput: TextInput;

  eInputType: typeof ERWInputType = ERWInputType;

  GoogleAutocomplete: any;
  autocomplete: IFormGooglePlacesInput;
  autocompleteArray: IFormGooglePlacesInput[] = [];
  autocompleteItems: any[];
  geocoder: any;
  onchange: any;
  inputWasFocused: boolean = false;
  constructor(public zone: NgZone, private _renderer: Renderer) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder;
    this.autocompleteItems = [];
  }
  ngOnInit(): void {
    this.initAutoComplete();
  }
  initAutoComplete() {
    this.autocomplete = { value: '', location: { lat: 0, lng: 0 }, id: -1 };
  }
  isFormSubmitted() {
    if (this.model.form)
      return this.model.form.submitted;
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

    let selectedValue: IFormGooglePlacesInput = {
      id: item.place_id,
      value: item.description,
      location: {
        lat: -1,
        lng: -1
      }
    }
    if (!this.model.multiple)
      this.autocompleteItems = [];
    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      this.zone.run(() => {
        if (status === 'OK' && results[0]) {
          selectedValue.location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };

          if (this.model.multiple) {
            let indexOfItem = this.autocompleteArray.findIndex(i => i.id == selectedValue.id);
            if (indexOfItem == -1)
              this.autocompleteArray.push(JSON.parse(JSON.stringify(selectedValue)))
            else
              this.autocompleteArray.splice(indexOfItem, 1);
            this.onchange(this.autocompleteArray);
          } else {
            this.autocomplete = selectedValue;
            this.onchange(this.autocomplete);
          }
        }
      })
    })
  }

  removeItemFromAutocompleteArray(location: IFormGooglePlacesInput) {
    let indexOfRemovedItem = this.autocompleteArray.findIndex(i => i.id == location.id);
    this.autocompleteArray.splice(indexOfRemovedItem, 1);
    this.onchange(this.autocompleteArray);
  }

  isLocationSelected(location) {
    return this.autocompleteArray.filter(i => i.id == location.place_id).length > 0;
  }

  registerOnChange(fn: any): void {
    this.onchange = fn;
  }
  validate() {
    if (this.model.multiple) {
      if (this.autocompleteArray.length == 0 && this.required && this.inputWasFocused) {
        {
          return {
            "location": "location not valid"
          };
        }
      }
    } else {
      if ((!this.autocomplete.value || !this.autocomplete.location.lat || !this.autocomplete.location.lng) && this.required && this.inputWasFocused) {
        // this.inputContainer.nativeElement.className = 'input-container input-container-error';
        return {
          "location": "location not valid"
        };
      }
      // this.inputContainer.nativeElement.className = 'input-container';
      return null
    }
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
  id: any;
  value: string;
  location: {
    lat: string | number;
    lng: string | number
  }
}
export interface IRWionic3GoogleMapsAutocompleteInputModel {
  form?: NgForm;
  hideIcon?: boolean;
  iconColor?: string
  multiple?: boolean;
  checkBoxColor?: string;
  inputType?: ERWInputType
  placeholder: string;
}

