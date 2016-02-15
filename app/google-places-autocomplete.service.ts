import {Injectable} from 'angular2/core';

export interface AutoSuggestService {
  getSuggestions(s : string);
}

class Suggestion {
  constructor(s : string){
    this.suggestion = s;
  }
  suggestion : string;
  toString() : string {
    return this.suggestion;
  }
}

@Injectable()
export class GooglePlacesAutocompleteService implements AutoSuggestService {
  private _googleAutocomplete : google.maps.places.AutocompleteService;
  private _autoCompleteOpts : google.maps.places.AutocompleteOptions;

  constructor (){
      this._googleAutocomplete = new google.maps.places.AutocompleteService();

      this._autoCompleteOpts = {
        componentRestrictions: {
          country: 'NL'
        },
        types: ['address']
      };
  }

  getSuggestions(str : string) {
    var query = Object.assign({
      input: str
    }, this._autoCompleteOpts);

    return new Promise<Suggestion[]>(resolve =>

      this._googleAutocomplete.getPlacePredictions(query, (results: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => {

        if(status === google.maps.places.PlacesServiceStatus.OK){
          var suggestions = results.map(r => new Suggestion(r.description));
          resolve(suggestions);
        } else{
          resolve(null);
        }
      })
    );
  }
}
