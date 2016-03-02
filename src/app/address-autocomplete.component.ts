import {Component, Input, Output, EventEmitter} from 'angular2/core';
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
  @Output() private addressSelected = new EventEmitter<PlaceSuggestion>();

  private selectedSuggestion: number;
  private suggestions: PlaceSuggestion[];
  private inputString: string;

  constructor(private _autoCompleteService: GooglePlacesAutocompleteService) {
    this.selectedSuggestion = 0;
    this.suggestions = [];
  }

  onKeyUp($event: KeyboardEvent) {
    var inputStr: string = (<HTMLInputElement>$event.target).value;

    if ($event.keyCode === KEYS.ENTER) {
      this.useCurrentSelection();
      return;
    }

    // On pressing up or down
    if ($event.keyCode === KEYS.ARROW_UP || $event.keyCode === KEYS.ARROW_DOWN) {
      if(this.suggestions.length){
        this.updateSuggestionSelection($event);
        this.inputString = this.suggestions[this.selectedSuggestion].description;
      }
      return;
    }

    if (!inputStr) {
      this.suggestions = [];
      this.selectedSuggestion = 0;
      return;
    }

    this._autoCompleteService.getSuggestions(inputStr).then(results => {
      return this.suggestions = results
    });
  }

  private updateSuggestionSelection($event: KeyboardEvent) {
    if ($event.keyCode === KEYS.ARROW_DOWN) {
      this.selectedSuggestion++;
    }

    if ($event.keyCode === KEYS.ARROW_UP) {
      this.selectedSuggestion--;
    }

    // Clamping selection between 0 and num suggestions.
    this.selectedSuggestion = Math.min(this.suggestions.length - 1, Math.max(0, this.selectedSuggestion));
  }

  private useCurrentSelection() {
    if (!this.suggestions.length) {
      return;
    }
    var selectedSuggestion = this.suggestions[this.selectedSuggestion];

    this.inputString = selectedSuggestion.description;
    this.suggestions = [];
    this.selectedSuggestion = 0;

    this.addressSelected.emit(selectedSuggestion);
  }
}
