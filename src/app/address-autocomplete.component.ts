import {
    Component, Inject, Input,
    Output, EventEmitter, ApplicationRef, ElementRef,
    SimpleChange
} from 'angular2/core';

import {GooglePlacesAutocompleteService} from './google-places-autocomplete.service';
import {PlaceSuggestion} from './place-suggestion';
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
    styleUrls: ['styles/autocomplete.style.css'],
    providers: [GooglePlacesAutocompleteService]
})
export class AddressAutocompleteComponent {
    @Input() private placeholder: string;
    @Input() private country: string;
    @Output() public onAddress = new EventEmitter<Address>();

    private autoCompleteService: IAutocompleteService;
    private applicationRef: ApplicationRef;
    private el: ElementRef;

    private selectedSuggestion: PlaceSuggestion;
    private suggestions: PlaceSuggestion[];
    private address: Address;
    private inputString: string;
    private houseNumber: string;
    private showHousNumberField: boolean = false;

    constructor(
        el: ElementRef,
        autoCompleteService: GooglePlacesAutocompleteService,
        applicationRef: ApplicationRef
    ) {
        this.el = el;
        this.autoCompleteService = autoCompleteService;
        this.applicationRef = applicationRef;

        this.suggestions = [];
    }

    ngOnInit() {
      this.autoCompleteService.country = this.country;
    }

    ngOnChanges(changes: {country: SimpleChange, address: SimpleChange}){
      if(changes.country){
        this.autoCompleteService.country = changes.country.currentValue;
        this.inputString = null;
        this.showHousNumberField = null;
      }
    }

    private onKeyUp(keyCode: number, fieldStreet: HTMLInputElement) {
        if (keyCode === KEYS.ENTER) {
            fieldStreet.blur()
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
    private useCurrentSuggestion() {
        if (!this.selectedSuggestion) {
            return;
        }

        // Replace input field with current selected suggestion.
        this.inputString = this.selectedSuggestion.description;

        // Remove suggestion list
        this.suggestions = [];

        // Get the address details (components) based on the google placeid
        let placeId = this.selectedSuggestion.id;

        this.autoCompleteService.getSuggestionDetails(placeId).then(placeDetail => {
          let address = placeDetail.address;

          this.showHousNumberField = !address.houseNumber;
          this.address = address;
          this.onAddress.emit(address);
          this.applicationRef.tick();
        });
    }

    private onBlurHouseNumber(value) {
        if (!value) {
            return;
        }

        // Add the housenumber to the current querystring, ask google for predictions -> use first suggestion.
        let description = this.selectedSuggestion.description;
        let addrCmp = description.split(', ');

        addrCmp.splice(1, 0, value);

        let newDescription = addrCmp.join(' ');

        this.autoCompleteService.getSuggestions(newDescription).then(results => {
            if (results.length < 1) {
                return;
            }

            this.selectedSuggestion = results[0];
            this.houseNumber = '';
            this.useCurrentSuggestion();
        });
    }
}
