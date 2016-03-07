import {
  Component, ViewChildren, Inject, Input,
  Output, EventEmitter, ApplicationRef, ElementRef
} from 'angular2/core';

import {GooglePlacesAutocompleteService} from './google-places-autocomplete.service';
import {PlaceSuggestion} from './place-suggestion';
import {IAutocompleteService} from './autocomplete-service';

const KEYS = {
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ENTER: 13
};

@Component({
  selector: 'address-autocomplete',
  templateUrl: 'templates/autocomplete.tpl.html',
  styleUrls: ['styles/autocomplete.style.css'],
  providers: [GooglePlacesAutocompleteService]
})
export class AddressAutocompleteComponent {
  @Input() private placeholder: string;
  @Output() public onAddress = new EventEmitter<any>();

  private selectedSuggestion: PlaceSuggestion;
  private suggestions: PlaceSuggestion[];
  private address: any = {};
  private inputString: string;
  private placesService: google.maps.places.PlacesService;
  private houseNumber : string = '';
  private showHousNumberField: boolean = false;

  constructor(
    private el: ElementRef,
    @Inject(GooglePlacesAutocompleteService) private autoCompleteService: IAutocompleteService,
    @Inject(ApplicationRef) private applicationRef: ApplicationRef
  ) {
    this.suggestions = [];
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  private onKeyUp(keyCode : number, fieldStreet: any) {
    if(keyCode === KEYS.ENTER){
      fieldStreet.blur()
      return;
    }

    // On pressing up or down
    if (keyCode === KEYS.ARROW_UP || keyCode === KEYS.ARROW_DOWN) {
      if(this.suggestions.length){
        this.updateSuggestionSelection(keyCode);
        this.inputString = this.selectedSuggestion.description;
      }
      return;
    }

    // User cleared the input field, or this is the first key pressed (which isnt a character).
    if(!this.inputString){
      this.selectedSuggestion = null;
      this.suggestions = [];
      return;
    }

    this.showSuggestions(this.inputString);
  }

  private showSuggestions (str) {
    this.autoCompleteService.getSuggestions(str).then(results => {
       this.suggestions = results;
       this.selectedSuggestion = results[0];
    });
  }

  /**
   * Use arrow keys to select previous or next suggestion
   */
  private updateSuggestionSelection(keyCode) {
    var selectedIndex = this.suggestions.indexOf(this.selectedSuggestion);

    if (keyCode === KEYS.ARROW_DOWN) {
      selectedIndex++;
    }

    if (keyCode === KEYS.ARROW_UP) {
      selectedIndex--;
    }

    // Clamping selection between 0 and num suggestions.
    selectedIndex = Math.min(this.suggestions.length - 1, Math.max(0, selectedIndex))

    this.selectedSuggestion = this.suggestions[selectedIndex];
  }

  /**
   * When the user
   */
  private useCurrentSuggestion (){
    if(!this.selectedSuggestion){
      return;
    }

    // Replace input field with current selected suggestion.
    this.inputString = this.selectedSuggestion.description;

    // Remove suggestion list
    this.suggestions = [];

    // Get the address details (components) based on the google placeid
    this.placesService.getDetails({
      placeId: this.selectedSuggestion.id
    }, (placeResult, status) => {
        this.address = this.parseGoogleResult(placeResult.address_components);
        this.showHousNumberField = !('street_number' in this.address);
        this.onAddress.emit(this.address);
        this.applicationRef.tick();
    });
  }

  private onBlurHouseNumber(value) {
    if(!value){
      return;
    }

    // Add the housenumber to the current querystring, ask google for predictions -> use first suggestion.
    let description = this.selectedSuggestion.description;
    let addrCmp = description.split(', ');

    addrCmp.splice(1, 0, value);

    let newDescription = addrCmp.join(' ');

    this.autoCompleteService.getSuggestions(newDescription).then(results => {
       this.selectedSuggestion = results[0];

       //
       setTimeout(() => this.useCurrentSuggestion());

       this.houseNumber = '';
    });
  }

  /**
   * Transform google address components array to a type-name map.
   */
  private parseGoogleResult(addressComponents){

    return addressComponents.reduce((mapping, addrComponent) => {

      mapping[addrComponent.types[0]] = addrComponent.long_name;
      return mapping;

    }, {});
  }
}
