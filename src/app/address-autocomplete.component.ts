import {
    Component, Inject, Input,
    Output, EventEmitter, ElementRef,
    SimpleChange
} from 'angular2/core';

import {GooglePlacesAutocompleteService} from './google-places-autocomplete.service';
import {PlaceSuggestion} from './place-suggestion';
import {PlaceDetails} from './place-details';
import {Address} from './address';
import {IAutocompleteService} from './autocomplete-service';

const KEYS = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ENTER: 13
};

@Component({
    selector: 'address-autocomplete',
    templateUrl: 'templates/autocomplete.tpl.html',
    styles: [`
      .selected {
        background-color: hsla(200, 100%, 50%, 0.2);
      }
    `],
    providers: [GooglePlacesAutocompleteService]
})
export class AddressAutocompleteComponent {
    @Output() public onAddress = new EventEmitter<Address>();

    @Input() public placeholderStreet: string;
    @Input() public placeholderHouseNumber: string;
    @Input() public placeholderPostalCode: string;
    @Input() public country: string;

    public address: Address;

    private autoCompleteService: IAutocompleteService;

    private selectedSuggestion: PlaceSuggestion;
    private suggestions: PlaceSuggestion[];
    private inputString: string;
    private manualHouseNumber: string;
    private manualPostalCode: string;

    constructor(
        autoCompleteService: GooglePlacesAutocompleteService
    ) {
        this.autoCompleteService = autoCompleteService;
        this.suggestions = [];
    }

    private ngOnInit() {
      this.autoCompleteService.country = this.country;
    }

    private ngOnChanges(changes: {country: SimpleChange, address: SimpleChange}) {
      if (changes.country) {
        this.autoCompleteService.country = changes.country.currentValue;
        this.inputString = null;
        this.address = null;
      }
    }

    private onKeyUp(keyCode: number, fieldStreet: HTMLInputElement) {
        if (keyCode === KEYS.ENTER) {
            fieldStreet.blur();
            return;
        }

        // On pressing up or down
        if (keyCode === KEYS.ARROW_UP || keyCode === KEYS.ARROW_DOWN) {
            if (this.suggestions.length) {
                this.updateSuggestionSelection(keyCode);
                this.inputString = this.selectedSuggestion.description;
            }
            return;
        }

        // User cleared the input field, or this is the first key pressed (which isnt a character).
        if (!this.inputString) {
            this.selectedSuggestion = null;
            this.suggestions = [];
            return;
        }

        this.showSuggestions(this.inputString);
    }

    private showSuggestions(str) {
        this.autoCompleteService.getSuggestions(str).then(results => {
            this.suggestions = results;
            this.selectedSuggestion = results[0];
        });
    }

    /**
     * Use arrow keys to select previous or next suggestion
     */
    private updateSuggestionSelection(keyCode) {
        let selectedIndex = this.suggestions.indexOf(this.selectedSuggestion);

        if (keyCode === KEYS.ARROW_DOWN) {
            selectedIndex++;
        } else if (keyCode === KEYS.ARROW_UP) {
            selectedIndex--;
        }

        // Clamping selection between 0 and num suggestions.
        selectedIndex = Math.min(this.suggestions.length - 1, Math.max(0, selectedIndex));

        this.selectedSuggestion = this.suggestions[selectedIndex];
    }

    /**
     * When the user
     */
    private useCurrentSuggestion() {
        if (!this.selectedSuggestion) {
            return;
        }

        // Replace input field with current selected suggestion.
        this.inputString = this.selectedSuggestion.description;

        // Clear current suggestion list
        this.suggestions = [];

        // Get the address details (components) based on the google placeid
        let placeId = this.selectedSuggestion.id;

        return this.autoCompleteService.getSuggestionDetails(placeId).then(placeDetail => {
          let address: Address = placeDetail.address;

          if (address.isComplete) {
            // remove manual housenumber, postalcode override
            this.manualHouseNumber = '';
            this.manualPostalCode = '';
          }

          this.address = address;
          this.onAddress.emit(address);
        });
    }

    private onBlurHouseNumber(houseNumber: string) {
        this.manualHouseNumber = houseNumber;

        // copy the current address to get a new search string containing the housenumber.
        let tempAddress = new Address();
        Object.assign(tempAddress, this.address);

        tempAddress.houseNumber = houseNumber;

        this.autoCompleteService.getSuggestions(tempAddress.toString()).then((results: PlaceSuggestion[]) => {
            let bestSuggestion = results[0];
            this.autoCompleteService.getSuggestionDetails(bestSuggestion.id).then((placeDetail: PlaceDetails) => {

              if (placeDetail.address.isComplete()) {
                this.selectedSuggestion = bestSuggestion;
                this.useCurrentSuggestion();
              } else {
                this.address.houseNumber = houseNumber;
                this.onAddress.emit(this.address);
              }
            });
        });
    }

    private onBlurPostalCode (postalCode: string) {
      this.manualPostalCode = postalCode;
      this.address.postalCode = postalCode;
      this.onAddress.emit(this.address);
    }
}
