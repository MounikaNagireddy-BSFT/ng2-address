import {Component, Inject, Input, Output, EventEmitter, ApplicationRef} from 'angular2/core';
import {GooglePlacesAutocompleteService} from './google-places-autocomplete.service';
import {PlaceSuggestion} from './placeSuggestion';

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
  @Output() private addressSelected = new EventEmitter<any>();

  private selectedSuggestion: PlaceSuggestion;
  private address: any;
  private suggestions: PlaceSuggestion[];
  private inputString: string;
  private placesService: google.maps.places.PlacesService;
  private showStreetField: boolean = false;

  constructor(
    private autoCompleteService: GooglePlacesAutocompleteService,
    @Inject(ApplicationRef) private applicationRef: ApplicationRef
  ) {
    this.suggestions = [];
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  private onKeyUp(keyCode : number) {
    if(keyCode === KEYS.ENTER){
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

    if(!this.inputString){
      this.selectedSuggestion = null;
      this.suggestions = [];
      return;
    }

    this.autoCompleteService.getSuggestions(this.inputString).then(results => {
       this.suggestions = results;
       this.selectedSuggestion = results[0];
       return;
    });
  }

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

  private onBlur (){
    var prediction = this.selectedSuggestion;
    this.inputString = this.selectedSuggestion.description;

    this.suggestions = [];

    this.placesService.getDetails({
      placeId: prediction.place_id
    }, (placeResult, status) => {
        var addr = this.parseGoogleResult(placeResult);

        this.inputString = placeResult.formatted_address;
        this.addressSelected.emit(addr);
        this.applicationRef.tick();
    });
  }

  private parseGoogleResult(placeResult){
    var components = placeResult.address_components;

    var typesMapped = components.reduce(function(acc, cur){
      acc[cur.types[0]] = cur.long_name;
      return acc;
    }, {});

    console.log(typesMapped);
    console.log(`Street: ${typesMapped.route} Housenumber: ${typesMapped.street_number}`);

    this.showStreetField = !("street_number" in typesMapped);
    console.log('show street field: ' + this.showStreetField);

    return typesMapped;
  }
}
