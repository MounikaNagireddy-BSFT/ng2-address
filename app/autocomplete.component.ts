import {Component} from 'angular2/core';
import {GooglePlacesAutocompleteService} from './google-places-autocomplete.service';

@Component({
  selector: 'input-autocomplete',
  templateUrl: 'app/templates/autocomplete.component.html',
  styleUrls: ['app/styles/autocomplete.style.css'],
  providers: [GooglePlacesAutocompleteService]
})
export class AutocompleteComponent {
  private selectedSuggestion : number;
  private suggestions : any[];

  constructor (private _autoCompleteService : GooglePlacesAutocompleteService) {
    this.selectedSuggestion = 0;
    this.suggestions = [];
  }

  updateSuggestions( $event : KeyboardEvent ){
    var inputStr : string = (<HTMLInputElement>$event.target).value;
    console.log(inputStr);

    this._autoCompleteService.getSuggestions(inputStr).then(results => {
      console.log(results);
      return this.suggestions = results
    });

    if($event.keyCode === 40){
      this.selectedSuggestion++;
    }

    if($event.keyCode === 38){
      this.selectedSuggestion = (this.suggestions.length + this.selectedSuggestion -1) % this.suggestions.length ;
    }

    if(this.selectedSuggestion >= this.suggestions.length){
      this.selectedSuggestion = 0;
    }
  }
}
